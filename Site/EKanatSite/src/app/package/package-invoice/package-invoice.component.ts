import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FieldDetailViewModel, FieldsListVM, PhenologiesVM } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { FieldService } from 'src/app/shared/services/field.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import Swal from 'sweetalert2';
import {TranslateService} from "../../shared/services/traslate.service";

@Component({
  selector: 'app-package-invoice',
  templateUrl: './package-invoice.component.html',
  styleUrls: ['./package-invoice.component.scss']
})
export class PackageInvoiceComponent implements OnInit, OnDestroy {
  
  @ViewChild('fieldsModal' , {static:true}) fieldsModal:ElementRef|undefined;
  SelectedField:FieldDetailViewModel|undefined;
  isChanged:boolean = false;
  FieldsList:FieldsListVM[] = [];

  PeriodCount:number|null = 1;
  MaxPeriodCount:number[] = [1];
  FieldPhenologiesList: PhenologiesVM[] = []
  fieldId?:number;
  
  basePrice:number = 100000;
  taxPercent:number = 9;
  OrderDetail:any;

  translateUnsub:any

  callToSupportForProductGrowthPeriod:string = ''
  packageDescriptionTemplate:string = ''

  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fieldService:FieldService,
    private paymentService:PaymentService,
    private dateTimeService:DateTimeService,
    private router:Router,
    private route:ActivatedRoute,
    private translateService:TranslateService
  ) {
    this.route.queryParams.subscribe(params=>{this.fieldId = params['fieldId']})
  }

  ngOnInit(): void {
    this.translateUnsub = this.translateService.data.subscribe({
      next:(data)=>{
        this.callToSupportForProductGrowthPeriod = data['callToSupportForProductGrowthPeriod'] || 'callToSupportForProductGrowthPeriod'
        this.packageDescriptionTemplate = data['packageDescriptionTemplate'] || 'packageDescriptionTemplate'
      }
    })

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

            this.PeriodCount = 1;
            this.OrderDetail = null;
          }
        },
        error:()=>{
          this.isChanged = false;
        }
      })
    
    this.getFieldPhenologiesList(field.id);
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
            if(this.FieldPhenologiesList.length==0){
              Swal.fire({
                icon:"info",
                text:this.callToSupportForProductGrowthPeriod
              })
            }else{
              this.SubmitPlaceOrder();
            }

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

            setTimeout(() => {
              this.calcDatesDifferent()

            }, 1000);  
          }
        }
      })
  }

  calcDatesDifferent(){
    if(
      this.OrderDetail && this.OrderDetail.orderDate && 
      this.SelectedField && this.SelectedField.cultivationDate &&
      this.FieldPhenologiesList && this.FieldPhenologiesList[0].startDate  
    ){
      let _orderDate = this.dateTimeService.toGeorgianDate(this.OrderDetail.orderDate);
      let orderDate = new Date(_orderDate).getTime();

      let _cultivationDate = this.dateTimeService.toGeorgianDate(this.SelectedField.cultivationDate);
      let cultivationDate = new Date(_cultivationDate).getTime();

      let _startPeriod = this.dateTimeService.toGeorgianDate(this.FieldPhenologiesList[0].startDate);
      let startPeriod = new Date(_startPeriod).getTime();

      if(orderDate-cultivationDate>0 && orderDate-startPeriod>0){
        let text:string = this.packageDescriptionTemplate;
        text = text.replace('"text1"',`«${this.SelectedField.name}»`)
        text = text.replace('"text1"',`«${this.SelectedField.name}»`)
        text = text.replace('"text2"',`<span dir="ltr" class="d-inline-block">«${this.OrderDetail.packageStartDate}»</span>`)
        text = text.replace('"text3"',`<span dir="ltr" class="d-inline-block">«${this.OrderDetail.packageEndDate}»</span>`)
        text = text.replace('"text4"',`<span dir="ltr" class="d-inline-block">«${this.OrderDetail.packageStartDate}»</span>`)
        text = text.replace('"text5"',`<span dir="ltr" class="d-inline-block">«${this.OrderDetail.orderDate}»</span>`)

        Swal.fire({
          html:text,
          icon:'info'
        })

      }
    }
  }


  goToPayment(){
    this.spinner.show();
    this.paymentService.goToPayment(
      {
        orderId: this.OrderDetail.orderId,
      }
    ).subscribe({
        next:(res:any)=>{
          if(res.isSuccess)
          {
            this.spinner.hide();
            window.location.href = res.data;            
          }
        }
      })
  }

  ngOnDestroy(): void {
    if(this.translateUnsub){
      this.translateUnsub.unsubscribe()
    }
  }

}
