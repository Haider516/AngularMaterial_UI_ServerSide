import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { TreeWithCheckBoxComponent } from './component/tree-with-check-box/tree-with-check-box.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,MatIcon,TreeWithCheckBoxComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
}
