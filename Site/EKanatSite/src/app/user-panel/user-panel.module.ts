import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPanelComponent } from './user-panel.component';

const routes: Routes = [

  { path: '', component: UserPanelComponent,
    children: [
      {path:'', canActivate: [AuthGuard]  , component:DashboardComponent},
      {path:'dashboard' , canActivate: [AuthGuard] , component:DashboardComponent},

      {path:'imagery' , canActivate: [AuthGuard] , loadChildren: () => import('../imagery/imagery.module').then(m => m.ImageryModule)},
      {path:'fields' , canActivate: [AuthGuard] , loadChildren: () => import('../fields/fields.module').then(m => m.FieldsModule)},
      {path:'weather' , canActivate: [AuthGuard] , loadChildren: () => import('../weather/weather.module').then(m => m.WeatherModule)},
      {path:'account' , canActivate: [AuthGuard] , loadChildren: () => import('../account/account.module').then(m => m.AccountModule)},
      
      {path:'**' , canActivate: [AuthGuard] , redirectTo:'dashboard'}
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
