import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'' , component:HomeComponent},
  {path:'home' , component:HomeComponent},
  {path:'login' , component:LoginComponent},
  {path:'' , loadChildren: () => import('./user-panel/user-panel.module').then(m => m.UserPanelModule)},
  {path:'payment' , loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)},
  {path:'**' , redirectTo:''},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes , {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
