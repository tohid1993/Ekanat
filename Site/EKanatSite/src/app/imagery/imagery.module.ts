import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageryComponent } from './imagery/imagery.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ImageryComponent}
];

@NgModule({
  declarations: [
    ImageryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ImageryModule { }
