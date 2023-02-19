import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { SingleImageryComponent } from './single-imagery/single-imagery.component';

const routes: Routes = [
  { path: 'field/:id', component: ComparePageComponent},
  // { path: '**', component: ComparePageComponent}
];

@NgModule({
  declarations: [
    ComparePageComponent,
    SingleImageryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CompareModule { }
