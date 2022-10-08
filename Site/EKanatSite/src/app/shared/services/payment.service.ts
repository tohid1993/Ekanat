import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private gService:GeneralService
  ) { }

  PlaceOrder(data:any){
    return this.gService.post("v1/Packages/PlaceOrder",data,{})
  }

  goToPayment(data:any){
    return this.gService.post("v1/Payments/Payment",{},data)
  }

  getOrderPaymentDetail(orderId:number){
    return this.gService.get("v1/Payments/GetOrderPaymentInfo",{orderId:orderId})
  }
}

