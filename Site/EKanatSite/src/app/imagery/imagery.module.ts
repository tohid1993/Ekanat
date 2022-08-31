import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageryComponent } from './imagery/imagery.component';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: 'analytics/:id', component: ImageryComponent},
  { path: 'tasks/:id/:name', component: TasksComponent},
];

@NgModule({
  declarations: [
    ImageryComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ImageryModule { }
