import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';



const routes: Routes = [
  { path: 'list', component: TransactionsListComponent},
  { path: '**', component: TransactionsListComponent}

];



@NgModule({
  declarations: [
    TransactionsListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class BankTransactionsModule { }
