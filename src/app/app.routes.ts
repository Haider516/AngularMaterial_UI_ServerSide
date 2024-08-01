import { Routes } from '@angular/router';
import { AboutPageComponent } from './component/about-page/about-page.component';
import { HomepageComponent } from './component/homepage/homepage.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'card', component: AboutPageComponent },
];
