import {  Component } from '@angular/core';
import {  TreeWithCheckBoxComponent } from '../tree-with-check-box/tree-with-check-box.component';

import { CommonModule } from '@angular/common';
//import { FlatTreeComponent } from '../flat-tree/flat-tree.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TreeWithCheckBoxComponent,CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent  {

}
