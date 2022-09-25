import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepaymentComponent } from './prepayment/prepayment.component';
import { PaymentBillComponent } from './payment-bill/payment-bill.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: 'prepayment', component: PrepaymentComponent},
  { path: 'success', component: PaymentBillComponent},
  { path: 'failure', component: PaymentErrorComponent},
];

@NgModule({
  declarations: [
    PrepaymentComponent,
    PaymentBillComponent,
    PaymentErrorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PaymentModule { }
