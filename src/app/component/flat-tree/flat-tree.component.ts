// import { Component } from '@angular/core';
// import { FlatTreeControl } from '@angular/cdk/tree';
// import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { TreeServiceService } from '../../service/tree-service.service';
// import { MatIcon, MatIconModule } from '@angular/material/icon';
// import { CommonModule } from '@angular/common';
// import { MatCheckbox } from '@angular/material/checkbox';
// import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
// import { MatInput } from '@angular/material/input';

// const HttpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

// interface TreeNode {
//   id: number;
//   name: string;
//   children?: TreeNode[];
// }

// interface ExampleFlatNode {
//   expandable: boolean;
//   name: string;
//   level: number;
// }

// @Component({
//   selector: 'app-flat-tree',
//   standalone: true,
//   imports: [
//     MatTreeModule,
//     MatIconModule,
//     CommonModule,
//     MatTreeModule,
//     MatIcon,
//     MatCheckbox,
//     MatLabel,
//     MatError,
//     MatFormField,
//     MatInput
//   ],
//   templateUrl: './flat-tree.component.html',
//   styleUrls: ['./flat-tree.component.css']
// })
// export class FlatTreeComponent {

//   products: TreeNode[] = [];
//   pageMeta: any;

//   flatNodeMap = new Map<ExampleFlatNode, TreeNode>();

//   /** Map from nested node to flattened node. This helps us to keep the same object for selection */
//   nestedNodeMap = new Map<TreeNode, ExampleFlatNode>();


//   // treeControl: FlatTreeControl<ExampleFlatNode>;
//   // treeFlattener: MatTreeFlattener<TreeNode, ExampleFlatNode>;
//   // dataSource: MatTreeFlatDataSource<TreeNode, ExampleFlatNode>;

//   private _transformer = (node: TreeNode, level: number) => {
//     return {
//       expandable: !!node.children && node.children.length > 0,
//       name: node.name,
//       level: level,
//     };
//   };

//   treeControl = new FlatTreeControl<ExampleFlatNode>(
//     node => node.level,
//     node => node.expandable,
//   );

//   treeFlattener = new MatTreeFlattener(
//     this._transformer,
//     node => node.level,
//     node => node.expandable,
//     node => node.children,
//   );

//   dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

//   constructor(private http: HttpClient, private treeService: TreeServiceService) {
//     this.initialize();
//   }

//   initialize() {
//     this.treeService.dataChange.subscribe((data: { players: any[]; pagination: any }) => {
//       this.products = this.transformData(data.players);
//       debugger
//       this.pageMeta = data.pagination;
//       this.dataSource.data = this.products;
//     });
//   }

//   hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

//   private transformData(data: any[]): TreeNode[] {
//     const map = new Map<number, TreeNode>();

//     // First pass: create a map of all nodes
//     data.forEach(item => {
//       const node: TreeNode = {
//         id: item.id,
//         name: item.attributes.name,
//         children: []
//       };
//       map.set(node.id, node);
//     });

//     // Second pass: populate children
//     data.forEach(item => {
//       const parentId = item.attributes.parent.data?.id;
//       if (parentId) {
//         const parent = map.get(parentId);
//         const child = map.get(item.id);
//         if (parent && child) {
//           parent.children!.push(child);
//         }
//       }
//     });

//     // Extract top-level nodes (those without parents)
//     const tree = Array.from(map.values()).filter(node => !data.some(item => item.id === node.id && item.attributes.parent.data));

//     return tree;
//   }


//   dispatchedNode(node: any) {
//     console.log("dispatch",typeof(node));
   
//   }

//   addNode(node: any) {
//     console.log("ADD",node);
    
//   }

//   deleteNode(node: any) {
//     console.log("delete",node);
    
//   }

//   updateNode(node: any) {
//     console.log("update",node);
    
//   }
// }
