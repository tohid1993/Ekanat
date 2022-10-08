import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.scss']
})
export class PaymentErrorComponent implements OnInit {

  description!:string;

  constructor(
    private route:ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params=>{this.description = params['description']})
  }

  ngOnInit(): void {
  }

}
