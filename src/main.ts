import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



  // npm install @angular/material@18.1.2 @angular/cdk@ 18.1.2 @angular/animations@18.1.2
