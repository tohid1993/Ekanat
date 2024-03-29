import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment.service';
import {TranslateService} from "../../shared/services/traslate.service";

@Component({
  selector: 'app-payment-bill',
  templateUrl: './payment-bill.component.html',
  styleUrls: ['./payment-bill.component.scss']
})
export class PaymentBillComponent implements OnInit {

  orderId!:number;
  orderDetail:any;

  constructor(
    private route:ActivatedRoute,
    private paymentService:PaymentService,
    private router:Router,
    private translateService:TranslateService
  ) {
    this.route.params.subscribe(params=>{this.orderId = params['orderId']})
  }

  ngOnInit(): void {
    this.getOrderDetail();
  }

  getOrderDetail(){
    this.paymentService.getOrderPaymentDetail(this.orderId)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.orderDetail = res.data;

            if(!res.data.isSuccess){
              window.location.href = "/payment/failure?description=" + this.translateService.translate('notFound')
            }
          }
        },
        error:(error:any)=>{   
          window.location.href = "/payment/failure?description=" + error.error.Message 
        }
        
      })
  }

}
