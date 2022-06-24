import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsComponent } from './fields/fields.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: FieldsComponent},
  { path: 'add', component: AddFieldComponent},
  { path: '**', component: FieldsComponent}

];


@NgModule({
  declarations: [
    FieldsComponent,
    AddFieldComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FieldsModule { }
