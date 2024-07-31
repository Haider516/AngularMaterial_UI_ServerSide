import { Routes } from '@angular/router';
import { AboutPageComponent } from './component/about-page/about-page.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'card', component:AboutPageComponent  },
];
