import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ConsultationRequestComponent } from './consultation-request/consultation-request.component';



const routes: Routes = [
  { path: 'request', component: ConsultationRequestComponent},
  { path: '**', component: ConsultationRequestComponent}

];



@NgModule({
  declarations: [
    ConsultationRequestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ConsultationModule { }
