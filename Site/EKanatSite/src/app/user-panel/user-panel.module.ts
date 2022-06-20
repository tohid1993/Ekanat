import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPanelComponent } from './user-panel.component';

const routes: Routes = [

  { path: '', component: UserPanelComponent,
    children: [
      {path:'' , component:DashboardComponent},
      {path:'dashboard' , component:DashboardComponent},
      
      {path:'**' , redirectTo:'dashboard'}
    ]
  }

];

@NgModule({
  declarations: [
    DashboardComponent,
    UserPanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class UserPanelModule { }
