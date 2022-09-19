import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ShopingCentersListComponent } from './shoping-centers-list/shoping-centers-list.component';



const routes: Routes = [
  { path: 'list', component: ShopingCentersListComponent},
  { path: '**', component: ShopingCentersListComponent}

];



@NgModule({
  declarations: [
    ShopingCentersListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ShopingCentersModule { }
