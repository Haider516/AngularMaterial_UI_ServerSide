import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, Injectable, Input, input, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { MatTreeModule } from '@angular/material/tree';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PaginationMeta, PlayersService } from '../../service/players.service';
import { PSLPlayer, PSLPlayerTree } from '../../playerInterface';
import { TreeServiceService } from '../../service/tree-service.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


const HttpOptions = {
  'headers': new HttpHeaders({
    'Content-Type': 'application/json'
  })
}



//tree declarations
export class TodoItemNode {
  status!: boolean;
  children!: TodoItemNode[];
  id!: number;
  name!: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {

  id!: number;
  name!: string;
  level!: number;
  expandable!: boolean;
  hasChild!: boolean; // new property
  updating!: boolean;
  adding!: boolean;
  childChecked!: boolean;
  isdraged!: boolean;
  isRoot!: boolean;
  isLoading!: boolean;
  called!: boolean

}

export class NodeStatus {
  [key: number]: {
    node: TodoItemFlatNode,
    status: boolean
  };
}

interface ApiCrudResponse {
  status: boolean,
  message?: string,
  item?: TreeNode
}

export interface TreeNode {
  id: number;
  name: string;
  createdAt: string; // ISO 8601 date format
  updatedAt: string; // ISO 8601 date format
  publishedAt: string | null; // Can be null or a date string
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-tree-with-check-box',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTreeModule, MatIcon, MatCheckbox, MatLabel, MatError, MatFormField, MatInput, ButtonComponent,
    MatCard, MatProgressBarModule, MatCardContent, CommonModule, MatCard, MatCardContent, MatCardHeader, MatCardModule, FormsModule, MatSelectModule
  ],
  templateUrl: './tree-with-check-box.component.html',
  styleUrl: './tree-with-check-box.component.css',
  providers: [],
})


export class TreeWithCheckBoxComponent {
  /** Map from flat node to nested node.
   *  This helps us finding the nested node to be modified */
  private num: number = 0;
  selectOptions: TodoItemFlatNode[] = [];
  selected!: TodoItemFlatNode;
  products: TodoItemNode[] = [];
  pageMeta: any;
  //filter
  filterValue = "";
  projectState: number = 0

  nodeStatusList: NodeStatus = {};
  // searchBox = document.getElementById('search');

  //For Search Box Filtering
  searchInput = new Subject<string>();

  // This is Used to Clear the Input on Pagination
  @ViewChild('input') inputElement!: ElementRef;

  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private http: HttpClient, private treeService: TreeServiceService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    // Debounced search input handling
    this.searchInput.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    // Subscribe to data changes once in ngOnInit
    this.treeService.dataChanges.subscribe((data: { data: any[] }) => {
      this.products = data.data;
      this.dataSource.data = [...this.products];
    });
  }



  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.name === '';

  // isEvenIndex = (_: number, node: TodoItemFlatNode) => this.treeControl.dataNodes.indexOf(node) % 2 === 0;

  istrue = () => this.num === 1 ? true : false;

  //
  toupdate = (node: TodoItemFlatNode) => node.updating = true;
  toAdd = (node: TodoItemFlatNode) => node.adding = true;
  todrag = (node: TodoItemFlatNode) => node.isdraged = true;
  toload = (node: TodoItemFlatNode) => !node.isLoading;
  isCalled = (node: TodoItemFlatNode) => node.called = true;
  //might  be  used
  isRoot = (node: TodoItemFlatNode) => node.isRoot = true;
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  isChecked = (node: TodoItemFlatNode) => !node.childChecked

  transformer = (node: TodoItemNode, level: number) => {
    // 
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.id === node.id
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.level = level;
    debugger
    flatNode.level = level;
    debugger
    if (flatNode.level === 0) {

      flatNode.isRoot = true;
    }
    else {
      flatNode.isRoot = false;
    }
    //____________**********__________________
    // edit data portion
    // edit this to true to make it always expandable based on length
    //  flatNode.expandable = !!node.children?.length;
    if (node.children?.length === 0 || !node.children) {
      flatNode.expandable = node.status;
    }
    else {
      flatNode.expandable = !!node.children?.length
    }

    // add this line. this property will help 

    //  to hide the expand button in a node
    //flatNode.hasChild = !!node.children?.length;
    flatNode.hasChild = node.status;
    flatNode.updating = false;
    flatNode.isdraged = false;
    flatNode.adding = false;
    flatNode.isLoading = false;
    flatNode.called = false;
    //flatNode.childChecked = false;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    // const currentNocxcxcde = this.treeControl.
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const nodeFlatted: TodoItemNode = this.flatNodeMap.get(node)!;
    this.toAdd(node)

  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const flatNode = this.flatNodeMap.get(node);
    let parent = flatNode?.id;
    let name = itemValue

    if (name && parent) {
      //calling Service 
      let receivedObj: ApiCrudResponse;
      this.treeService.addNodeService(parent!, name)!.subscribe({
        next: (response) => {
          receivedObj = response;
          debugger
          if (receivedObj?.status) {
            // here flat is  the  parent 
            let node = new TodoItemNode();
            node.id = receivedObj?.item?.id!;
            node.name = receivedObj?.item?.name!;
            node.children = [];
            node.status = !receivedObj.status;

            flatNode?.children.push(node);
            //flatNode?.status!=true;
            debugger
            this.dataSource.data = [...this.dataSource.data];
          }
          else {
            console.log("message", receivedObj?.message);

          }
        },
        error: (error) => {
          console.error('Failed to add node:', error);
          // Handle the error appropriately
        }
      });

      //  debugger

    }

    // yahan API call hu  gi add karna  k liya 
  }

  deleteNode(node: TodoItemFlatNode) {
    // console.log(this.treeControl.dataNodes);
    const nodenew = this.flatNodeMap.get(node)

    if (nodenew?.children && nodenew.children.length > 0) {
      nodenew.children.map((item) => {
        let id = item.id;
        // this.treeService.deleteNodeService(id!)
        let nodenewNested = this.nestedNodeMap.get(item)
        debugger
        this.deleteNode(nodenewNested!);
      })
    }
    else {
      debugger
      let id = nodenew?.id;
      this.apiDeleteExtra(node!, id!)
    }

    debugger
    // this.treeService.deleteNodeService(nodenew?.id!)
    this.apiDeleteExtra(node!, nodenew?.id!)
  }

  //the api for delete is called in this fucntion 
  apiDeleteExtra(node: TodoItemFlatNode, id: Number) {
    let receivedObj: ApiCrudResponse;
    if (id) {
      this.treeService.deleteNodeService(id!).subscribe({
        next: (response) => {
          let receivedObj = response as ApiCrudResponse;
          debugger
          if (receivedObj.status) {
            // here flat is  the  parent 
            let id = receivedObj?.item?.id!;

            let newFlatedNode = this.flatNodeMap.get(node!);

            if (node.isRoot) {
              let index = this.dataSource.data.indexOf(newFlatedNode!)
              this.dataSource.data.splice(index, 1)
              this.dataSource.data = [...this.dataSource.data];
            }
            else {
              let parent = this.getParentNode(node)
              let newFlatedParent = this.flatNodeMap.get(parent!);

              let index = newFlatedParent?.children.indexOf(newFlatedNode!)
              newFlatedParent?.children.splice(index!, 1)
              debugger
              console.log(this.dataSource.data);
              this.dataSource.data = [...this.dataSource.data];
            }
          }
          else {
            console.log("message", receivedObj?.message);
          }
        },
        error: (error) => {
          console.error('Failed to add node:', error);
          // Handle the error appropriately
        }
      });
    }

  }

  //this works when i click  the  save button forthe updated field
  getupdatedValue(node: TodoItemFlatNode, item: string) {
    const nodenew = this.flatNodeMap.get(node);
    let id = nodenew?.id;
    if (item && id) {
      let receivedObj: ApiCrudResponse;
      this.treeService.updateNodeService(item, id!).subscribe({
        next: (response) => {
          receivedObj = response as ApiCrudResponse;
          debugger
          if (receivedObj?.status) {

            let newNode = this.flatNodeMap.get(node)!;

            newNode.name = receivedObj?.item?.name!;
            // debugger
            this.dataSource.data = [...this.dataSource.data];
          }
          else {
            console.log("message", receivedObj?.message);

          }
        },
        error: (error) => {
          console.error('Failed to add node:', error);
          // Handle the error appropriately
        }
      });

    }
  }

  updateNodeextra(node: TodoItemFlatNode) {
    this.toupdate(node);
    this.toupdate(node);
    debugger
    this.toupdate(node);
    debugger
  }

  dispatchedNode(node: TodoItemFlatNode) {
    this.todrag(node)

    this.treeService.updateSelectorOptions(node.id).subscribe({
      next: (response) => {
        let receivedObj = response as any;
        debugger
        if (receivedObj?.status) {
          this.selectOptions = receivedObj.item;
        }
        else {
          console.log("message", receivedObj?.message);
        }
      },
      error: (error) => {
        console.error('Failed to add node:', error);
        // Handle the error appropriately
      }
    });
  }

  // debug button
  updateNodePosition(node: TodoItemFlatNode) {

    let nodeFlat = this.flatNodeMap.get(node);
    let newParentID = this.selected?.id;
    let nodeToUpdatedID = nodeFlat?.id;
    //  debugger
    if (newParentID && nodeToUpdatedID) {
      this.treeService.postioning(newParentID!, nodeToUpdatedID!).subscribe({
        next: (response) => {
          let receivedObj = response as ApiCrudResponse;
          debugger
          if (receivedObj?.status) {

            let nodeParent = this.getParentNode(node);
            if (nodeParent) {
              let nodeParentNested = this.flatNodeMap.get(nodeParent);
              let indexFound = nodeParentNested?.children.indexOf(nodeFlat!);
              nodeParentNested?.children.splice(indexFound!, 1);
              if (nodeParentNested?.children.length === 0) {
                nodeParentNested.status = false;
              }
            }
            debugger
            let newParentNode = this.flatNodeMap.get(this.treeControl.dataNodes.find((item) => item.id === this.selected?.id)!)
            newParentNode?.children.push(nodeFlat!);
            let noded=this.nestedNodeMap.get(newParentNode!)
            this.selectOptions = [];
            this.treeControl.collapse(noded!)

          }

          if(node.isRoot){
            let foundindex=this.dataSource.data.indexOf(nodeFlat!)
            this.dataSource.data.splice(foundindex,1)
          }

          this.dataSource.data = [...this.dataSource.data];
        },

      });


    }
  }

  // Reference  parent   node : 
  getRootNode() {
    console.log(this.treeControl.dataNodes);
  }
  //working  ok
  getRootwrtNode(node: TodoItemFlatNode) {
    let parentNode = node;
    do {
      parentNode = this.getParentNode(parentNode)!;
      // it have to search for the parent; parent  nextime    
    } while (parentNode?.isRoot !== true)
    return parentNode;
  }

  otherRootNodes(rootNode: TodoItemFlatNode) {

    let roots = this.treeControl.dataNodes.filter(node => node.level === 0);
    let rootSibling = roots.filter(item => item != rootNode);//this return   array
    let allDescendants: TodoItemFlatNode[] = rootSibling.reduce((accumulator: TodoItemFlatNode[], currentValue) => {
      accumulator.push((currentValue!));
      accumulator.push(...this.treeControl.getDescendants(currentValue!));
      return accumulator;
    }, []);

    // allDescendants
    return allDescendants
  }

  getAllNodes() {
    this.treeControl.dataNodes
  }

  //it fetches  the paginated  Nodes
  async fetchNode(node: TodoItemFlatNode) {

    let nodeID = node.id
    this.nodeStatusList[nodeID] = {
      node: node,
      status: this.treeControl.isExpanded(node)
    }

    //  checking if the  nodes called already 

    if (node.called) {
      // Mark node as processed
      return;
    }

    let fetchName = node.id;

    if (this.treeControl.isExpanded(node)) {

      let flatNode: TodoItemNode = this.flatNodeMap.get(node)!;

      let length;
      // console.log(flatNode.children)

      if (flatNode.children) {
        length = flatNode.children.length;
      }
      else {
        length = 0
      }
      if (length === 0) {
        //  this.inputElement.nativeElement.value = '';
        //  console.log(flatNode.children.length);
        try {
          // Fetch children using the treeService and convert Observable to Promise
          let childs = await this.treeService.getChild(fetchName).toPromise();
          console.log('Fetched children:', childs);

          // Ensure the fetched data is an array
          if (!Array.isArray(childs)) {
            throw new Error('Fetched data is not an array');
          }

          // Convert received data to TodoItemNode array
          let mappedChildren = this.mapToTodoItemNodeArray(childs);

          let childlevel = node.level;
          // Get the corresponding flatNode
          let flatNode: TodoItemNode = this.flatNodeMap.get(node)!;
          // Ensure flatNode exists and update its children
          if (flatNode) {
            flatNode.children = mappedChildren;
          }


          // }
          console.log(this.treeControl.dataNodes);

          // Update dataSource (if necessary)
          this.dataSource.data = [...this.dataSource.data];

        } catch (error) {
          console.error('Error fetching node data', error);
        }
      }
    }
  }

  private mapToTodoItemNodeArray(data: any[]): TodoItemNode[] {
    return data.map(item => {
      let node = new TodoItemNode();
      node.id = item.id;
      node.name = item.name;
      node.children = [];
      node.status = item.status;
      return node;
    });
  }

  //This Below  are For Filtering
  performSearch(searchTerm: string) {
    searchTerm = searchTerm.trim();
    if (searchTerm.length > 1) {
      let x = this.treeService.filterData(searchTerm)
    }
    else {
      this.treeService.initialize()
    }
  }

  ngOnDestroy() {
    this.searchInput.complete();
  }

  async applyFilter(event: Event) {
    const filterX = (event.target as HTMLInputElement).value;
    this.filterValue = filterX;
    this.searchInput.next(this.filterValue)
  }

}
