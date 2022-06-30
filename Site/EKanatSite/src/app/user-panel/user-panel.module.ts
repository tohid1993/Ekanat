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

      {path:'imagery' , loadChildren: () => import('../imagery/imagery.module').then(m => m.ImageryModule)},
      {path:'fields' , loadChildren: () => import('../fields/fields.module').then(m => m.FieldsModule)},
      {path:'weather' , loadChildren: () => import('../weather/weather.module').then(m => m.WeatherModule)},


      
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
    RouterModule.forChild(routes ),
    SharedModule,
  ]
})
export class UserPanelModule { }
