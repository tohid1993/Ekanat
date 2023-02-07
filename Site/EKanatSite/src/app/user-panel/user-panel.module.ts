import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPanelComponent } from './user-panel.component';
import {TranslatePipe} from "../shared/pipe/translate.pipe";
import {AppModule} from "../app.module";
import { LicenseComponent } from './license/license.component';

const routes: Routes = [

  { path: '', component: UserPanelComponent,
    children: [
      // {path:'', canActivate: [AuthGuard]  , component:DashboardComponent},
      {path:'dashboard' , canActivate: [AuthGuard] , component:DashboardComponent},

      {path:'fields/imagery' , canActivate: [AuthGuard] , loadChildren: () => import('../imagery/imagery.module').then(m => m.ImageryModule)},
      {path:'fields' , canActivate: [AuthGuard] , loadChildren: () => import('../fields/fields.module').then(m => m.FieldsModule)},
      {path:'weather' , canActivate: [AuthGuard] , loadChildren: () => import('../weather/weather.module').then(m => m.WeatherModule)},
      {path:'account' , canActivate: [AuthGuard] , loadChildren: () => import('../account/account.module').then(m => m.AccountModule)},
      {path:'package' , canActivate: [AuthGuard] , loadChildren: () => import('../package/package.module').then(m => m.PackageModule)},
      {path:'shopingcenters' , canActivate: [AuthGuard] , loadChildren: () => import('../shoping-centers/shoping-centers.module').then(m => m.ShopingCentersModule)},
      {path:'payments' , canActivate: [AuthGuard] , loadChildren: () => import('../payment/payment.module').then(m => m.PaymentModule)},
      {path:'transactions' , canActivate: [AuthGuard] , loadChildren: () => import('../bank-transactions/bank-transactions.module').then(m => m.BankTransactionsModule)},
      
      // {path:'**' , canActivate: [AuthGuard] , redirectTo:'dashboard'}
    ]
  }

];

@NgModule({
  declarations: [
    DashboardComponent,
    UserPanelComponent,
    LicenseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class UserPanelModule { }
