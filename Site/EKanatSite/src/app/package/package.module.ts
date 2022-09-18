import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageListComponent } from './package-list/package-list.component';
import { PackageInvoiceComponent } from './package-invoice/package-invoice.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  { path: 'list', component: PackageListComponent},
  { path: 'invoice', component: PackageInvoiceComponent},
  { path: '**', component: PackageListComponent}

];



@NgModule({
  declarations: [
    PackageListComponent,
    PackageInvoiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PackageModule { }
