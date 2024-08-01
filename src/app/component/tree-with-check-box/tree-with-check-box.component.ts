import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Input, input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
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



const HttpOptions = {
  'headers': new HttpHeaders({
    'Content-Type': 'application/json'
  })
}



//tree declarations
export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
  hasChild!: boolean; // new property
  updating!: boolean;
  isdraged!: boolean;
  isRoot!: boolean;

}




/**
 * The Json object for to-do list data.
 */
//
// const usersCV = {
//   cvs: {
//     JohnDoe: {
//       summary: "Experienced software engineer with a passion for developing innovative programs.",
//       experienceJohnDoe: [
//         {
//           company: "Tech Solutions",
//           responsibilities: "Led a team of 10 in developing a new software platform, reducing processing time by 30%."
//         },
//       ]
//     },
//     JaneSmith: {
//       summary: "Results-driven marketing professional with over 10 years of experience in digital marketing.",
//       experienceJaneSmith: [
//         {
//           company: "MarketPro",
//           position: "Marketing Manager",
//         },

//       ]
//     },


//   },
//   document: {
//     "sheets": "A4size"
//   },
//   accessories: {
//     "abcd": "jiooo"
//   }

// };

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

  products: PSLPlayerTree[] = [];
  pageMeta!: PaginationMeta;
  
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private http: HttpClient,private treeService: TreeServiceService) {
    this.initialize();
  }

  initialize() {

    this.treeService.dataChange.subscribe((data: { players: PSLPlayerTree[]; pagination: PaginationMeta }) => {
      this.products = data.players;
      this.pageMeta = data.pagination;
    });
    
    console.log(  this.products,this.pageMeta);
    debugger
    const data = this.buildFileTree(this.products, 0);
    console.log('data', data);
    debugger
    // Notify the change.
    this.dataChange.next(data);
  }


  // here adding a api  to handle the data from strapi


  getproduct() {
    // this.http is the Angular HttpClient service.
    this.http
      .get("http://localhost:1337/api/products", {
        params: { populate: "*" },
      })
      .subscribe((response) => {
        console.log(response);
        return response;

      });
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;
      // debugger
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }
      //   debugger
      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    // changes for adding child
    debugger
    if (!parent.children)
      parent.children = [];
    parent.children.push({ item: name } as TodoItemNode);
    this.dataChange.next(this.data);
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }


  deleteItem(parentNode: TodoItemNode | undefined, node: TodoItemNode) {
    debugger
    if (parentNode === undefined) {
      this.data.shift();
    }
    else {
      const index = parentNode!.children.indexOf(node);
      //   debugger
      if (index !== -1) {
        parentNode!.children.splice(index, 1);
        debugger
      }
    }

    this.dataChange.next(this.data);

  }

  //to update the item value 

  updateItemNode(node: TodoItemNode, updateditem: string) {
    debugger
    node.item = updateditem;
    this.dataChange.next(this.data);
  }

  getChanged(selectedflatNode: TodoItemNode, nodeFlat: TodoItemNode, parentNode: TodoItemNode) {
    debugger
    // to handlecase   if the selected Node  is not root 
    if (parentNode !== undefined) {
      let index = parentNode.children.indexOf(nodeFlat)
      parentNode.children.splice(index, 1);
      debugger
    } else {  // if its root than no parent i.e parent is undefined 
      console.log(this.data);
      let indexOfParent = this.data.indexOf(nodeFlat);
      this.data.splice(indexOfParent, 1)
      //  debugger

    }

    if (!!selectedflatNode.children?.length) {
      selectedflatNode.children.push(nodeFlat);

      this.dataChange.next(this.data);
    } else {
      selectedflatNode.children = [];
      selectedflatNode.children.push(nodeFlat);
      this.dataChange.next(this.data);
    }

  }

}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-tree-with-check-box',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTreeModule, MatIcon, MatCheckbox, MatLabel, MatError, MatFormField, MatInput, ButtonComponent,
    MatCard, MatCardContent, CommonModule, MatCard, MatCardContent, MatCardHeader, MatCardModule, FormsModule, MatSelectModule
  ],
  templateUrl: './tree-with-check-box.component.html',
  styleUrl: './tree-with-check-box.component.css',
  providers: [ChecklistDatabase],
})

export class TreeWithCheckBoxComponent {
  /** Map from flat node to nested node.
   *  This helps us finding the nested node to be modified */
  private num: number = 0;
  selectOptions: TodoItemFlatNode[] = [];
  selected!: TodoItemFlatNode;
  //private tempNode!: TodoItemNode;
  // private tempNodeparent!: TodoItemNode | undefined;

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

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    console.log("actionn", this.treeFlattener);

    // 
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    //method for data source
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    console.log("h", this.dataSource);
    //   debugger
  }


  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  // isEvenIndex = (_: number, node: TodoItemFlatNode) => this.treeControl.dataNodes.indexOf(node) % 2 === 0;

  istrue = () => this.num === 1 ? true : false;

  //
  toupdate = (node: TodoItemFlatNode) => node.updating = true;
  todrag = (node: TodoItemFlatNode) => node.isdraged = true;
  //might  be  used
  isRoot = (node: TodoItemFlatNode) => node.isRoot = true;
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */


  transformer = (node: TodoItemNode, level: number) => {
    // debugger
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    if (flatNode.level === 0) {
      flatNode.isRoot = true;
    }
    else {
      flatNode.isRoot = false;
    }
    //it was previously flatNode.expandable = !!node.children?.length;
    // causing an  issue for every  item to be expandable 
    flatNode.expandable = !!node.children?.length; // edit this to true to make it always expandable
    // add this line. this property will help 
    //  to hide the expand button in a node
    flatNode.hasChild = !!node.children?.length;
    flatNode.updating = false;

    flatNode.isdraged = false;
    //  debugger
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    //debugger
    return flatNode;
  }


  ngOnInit() {
    this.getRootNode();
  }


  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    //  debugger
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    // debugger
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    debugger
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    debugger
    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    debugger
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    //  debugger
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    //   debugger
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
      debugger
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    // debugger
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
    // debugger
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
    const parentNode = this.flatNodeMap.get(node);

    debugger
    
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
    debugger
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    //get parent node 
    const parentNode = this.getParentNode(node);
    const parentNode1 = this.flatNodeMap.get(parentNode!);
    debugger
    if (parentNode1?.item === itemValue) {
      console.log("not poosible ");
    } else {
      this._database.updateItem(nestedNode!, itemValue);
    }

  }

  deleteNode(node: TodoItemFlatNode) {
    console.log(this.treeControl.dataNodes);

    //  const parentNode = this.flatNodeMap.get(node);
    const parentNode = this.getParentNode(node);

    const parentNode1 = this.flatNodeMap.get(parentNode!);
    const nodenew = this.flatNodeMap.get(node)
    debugger
    // console.log("Node:", node.);
    //  this._database.deleteItem( this.flatNodeMap.get(node)!);

    this._database.deleteItem(parentNode1!, nodenew!);


  }


  //the function is used  to save value to the temp data for updating 
  //it is the first function that  is invoked 
  //function  depreciated
  // updateNode(node: TodoItemFlatNode) {

  //   const parentNode = this.getParentNode(node);
  //   const parentNode1 = this.flatNodeMap.get(parentNode!);
  //   const nodenew = this.flatNodeMap.get(node)
  //   debugger
  //   this.num += 1;
  //   this.tempNode = nodenew!;
  //   this.tempNodeparent = parentNode1!;
  //   // console.log("Node:", node.);
  //   // this._database.detectingchange();

  //   //  this._database.updateItem(parentNode1!);
  // }

  //this works when i click  the  save button forthe updated field
  getupdatedValue(node: TodoItemFlatNode, item: string) {
    debugger
    // console.log(item);
    // const parentNode = this.getParentNode(node);
    // const parentNode1 = this.flatNodeMap.get(parentNode!);
    const nodenew = this.flatNodeMap.get(node)
    // nodenew?.item != item;
    //   console.log(nodenew);
    // this.tempNodeparent = undefined;
    // this.dataSource.data = [...this.dataSource.data];
    //  this.num -= 1;
    this._database.updateItemNode(nodenew!, item);
  }

  updateNodeextra(node: TodoItemFlatNode) {
    this.toupdate(node);
    debugger

    // debugger
    // this.num += 1;
    // this.tempNode = nodenew!;
    // this.tempNodeparent = parentNode1!;
    // console.log("Node:", node.);
    // this._database.detectingchange();

    //  this._database.updateItem(parentNode1!);
  }


  dispatchedNode(node: TodoItemFlatNode) {
    //    console.log(this._database[0]!.flatNodeMap());
    this.todrag(node)

    let rootNode: TodoItemFlatNode;
    let allNode: TodoItemFlatNode[];
    let result: TodoItemFlatNode[];
    debugger
    if (node.isRoot) {
      rootNode = node;
      node.isRoot = false
    } else {
      rootNode = this.getRootwrtNode(node)

      //Getting  selected Node decendent 
      const SelectedNodeDescendants = this.treeControl.getDescendants(node);
      //Getting  selected Node root descendant  
      allNode = this.treeControl.getDescendants(rootNode!);
      //making   alist of nodes that are decendent to the selected Node root excluding selected  node descendants
      result = (allNode.filter(item => !SelectedNodeDescendants.includes(item))).filter((item) => item !== node);

    }
    // let parentNode = this.flatNodeMap.get(this.getParentNode(node)!)
    // console.log(parentNode);
    debugger
    //geting root node as level zero /// making change to find the root wrt child
    //  let rootNode = this.treeControl.dataNodes[0];

    //let nodeINFflat = this.flatNodeMap.get(node)
    // if i did it wrt flat node its gives me descendants 
    //  let nodeNested = this.nestedNodeMap.get(nodeINFflat!);


    //fetching othernodes wrt the root node i.e other than fetched root i will get other   rooot sand  theirchild
    let nodearray = this.otherRootNodes(rootNode);

    let x = [...nodearray, ...(result! ?? [])];

    console.log(x);

    debugger
    // nodearray.push(result)
    // console.log();

    //Assigning option the  list Of the Node
    this.selectOptions = x;
    debugger

  }


  // debug button
  updateNodePosition(node: TodoItemFlatNode) {

    console.log("selected", this.selected);
    console.log(node);
    //The below is the Node that is to be positioned with  the node selected 
    let nodeFlat = this.flatNodeMap.get(node);
    //get parent for the node  

    let selectedflatNode = this.flatNodeMap.get(this.selected);
    let parentNode = this.flatNodeMap.get(this.getParentNode(node)!);
    this.selectOptions = [];
    this._database.getChanged(selectedflatNode!, nodeFlat!, parentNode!);

  }

  // Reference  parent   node : 
  getRootNode() {
    console.log(this.treeControl.dataNodes);
    //change
    //  let root = this.treeControl.dataNodes.filter(node => node.level === 0)[0];
    let root1 = this.treeControl.dataNodes.filter(node => node.level === 0);
    // root[0].isRoot! === true;
    // console.log(root[0]);
    root1.map((item) => {
      item.isRoot = true
    })
    console.log(root1);
    debugger
    //  this.isRoot(root);
  }


  //working  ok
  getRootwrtNode(node: TodoItemFlatNode) {
    let parentNode = node;
    do {
      parentNode = this.getParentNode(parentNode)!;
      // it have to search for the parent; parent  nextime 
      debugger
    } while (parentNode?.isRoot !== true)
    return parentNode;

  }


  otherRootNodes(rootNode: TodoItemFlatNode) {

    let roots = this.treeControl.dataNodes.filter(node => node.level === 0);
    let rootSibling = roots.filter(item => item != rootNode);//this return   array

    // rootSibling.reduce( (accumulator, currentValue)=>{

    //   accumulator.push( this.treeControl.getDescendants(currentValue!));

    // },[])

    let allDescendants: TodoItemFlatNode[] = rootSibling.reduce((accumulator: TodoItemFlatNode[], currentValue) => {
      accumulator.push((currentValue!));
      accumulator.push(...this.treeControl.getDescendants(currentValue!));
      return accumulator;
    }, []);
    debugger
    // allDescendants
    return allDescendants
  }



  getAllNodes() {
    this.treeControl.dataNodes
    debugger
  }

}






