import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FieldDetailViewModel, FieldsListVM, PhenologiesVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';
import { PaymentService } from 'src/app/shared/services/payment.service';

@Component({
  selector: 'app-package-invoice',
  templateUrl: './package-invoice.component.html',
  styleUrls: ['./package-invoice.component.scss']
})
export class PackageInvoiceComponent implements OnInit {
  
  @ViewChild('fieldsModal' , {static:true}) fieldsModal:ElementRef|undefined;
  SelectedField:FieldDetailViewModel|undefined;
  isChanged:boolean = false;
  FieldsList:FieldsListVM[] = [];

  PeriodCount:number=1;
  MaxPeriodCount:number[] = [1];
  FieldPhenologiesList: PhenologiesVM[] = []
  fieldId?:number;
  
  basePrice:number = 100000;
  taxPercent:number = 9;
  OrderDetail:any;

  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fieldService:FieldService,
    private paymentService:PaymentService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params=>{this.fieldId = params['fieldId']})
  }

  ngOnInit(): void {
    this.getFields();
  }

  openFieldsModal() {
    this.modalService.open(this.fieldsModal , { centered: true , size: 'xl'  });
  }

  choaseFieldModal(field:any){
    this.fieldId = field.id;
    this.SelectedField = undefined;
    this.OrderDetail = undefined;

    this.isChanged = true;
    this.spinner.show();
    this.fieldService.getFieldDetails(field.id)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.SelectedField = res.data;
            this.modalService.dismissAll();
            this.spinner.hide();
          }
        },
        error:()=>{
          this.isChanged = false;
        }
      })
    
    this.getFieldPhenologiesList(field.id);
    this.SubmitPlaceOrder();
  }


  getFields(){
    if(this.fieldId){
      this.choaseFieldModal({id:this.fieldId});
      return;
    }

    this.spinner.show();
    this.fieldService.getFieldsList()
      .subscribe({
        next:(res:any)=>{
          this.FieldsList = res.data;
          this.openFieldsModal();  
          this.spinner.hide();
        }
      })
  }

  goToAddNewField(){
    this.modalService.dismissAll();
    this.router.navigate(['/fields/add'])
  }

  getFieldPhenologiesList(fieldId:number){
    this.fieldService.getFieldPhenologiesList(fieldId)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess)
          {
            this.FieldPhenologiesList = res.data;
          }
        }
      })
  }

  SubmitPlaceOrder(){
    this.spinner.show();
    this.paymentService.PlaceOrder(
      {
        packageId: 0,
        fieldId: this.fieldId,
        phenologyCount: this.PeriodCount,
        basePrice: this.basePrice
      }
    ).subscribe({
        next:(res:any)=>{
          if(res.isSuccess)
          {
            this.OrderDetail = res.data;
            this.spinner.hide();
          }
        }
      })
  }

}
