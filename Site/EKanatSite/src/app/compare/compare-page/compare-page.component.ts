import {Component, OnInit} from '@angular/core';
import {FieldDetailViewModel, IndicatorsTypes} from "../../shared/models/model";
import {TranslateService} from "../../shared/services/traslate.service";
import {DateTimeService} from "../../shared/services/dateTime.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EeService} from "../../shared/services/ee.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {FieldService} from "../../shared/services/field.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.scss']
})
export class ComparePageComponent implements OnInit {

  generalLatLang:[string,string]  = ['38.0792', '46.2887']
  generalZoom:number  = 10
  changedFromIndex:number = -1;
  generalImageXY!:Array<number>;

  fieldId!:number;
  fieldDetail!:FieldDetailViewModel;
  hasPackage:boolean = false;

  dates:Array<string> = []
  initIndicatorType!:IndicatorsTypes

  constructor(
      public translateService:TranslateService,
      public dateTimeService:DateTimeService,
      public spinner:NgxSpinnerService,
      public eeService:EeService,
      public toastr:ToastrService,
      public router:Router,
      public route:ActivatedRoute,
      public fieldService:FieldService
  ) {
    this.route.params.subscribe(
        params=>{
          this.fieldId = params['id'];
        }
    )

    this.route.queryParams.subscribe(
        params=>{
          this.dates = params['dates'].split(',');
          this.initIndicatorType = params['type'] as IndicatorsTypes;
        }
    )
  }

  ngOnInit(): void {
    this.getFieldDetails()
  }

  setNewLatLng(data:[[string,string],number]){
    this.generalLatLang = data[0]
    this.changedFromIndex = data[1]
  }

  setNewZoom(data:[number,number]){
    this.generalZoom = data[0]
    this.changedFromIndex = data[1]
  }

  setImageXY(data:any){
    this.generalImageXY = data
  }

  getFieldDetails(){
    this.spinner.show();
    let self = this;
    this.fieldService.getFieldDetails(this.fieldId)
        .subscribe({
          next(res:any){
            self.fieldDetail = (res.data as FieldDetailViewModel);
            self.hasPackage = self.fieldDetail.hasPackage
            self.spinner.hide();
          }
        })
  }

  showPackageAlert(){
    if(!this.hasPackage){
      Swal.fire({
        text:this.translateService.translate('needPackageMessage'),
        icon:"warning",
        cancelButtonText: this.translateService.translate('dismissLabel'),
        confirmButtonText: this.translateService.translate('buyPlane'),
        showCancelButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/package/invoice'],{queryParams:{fieldId:this.fieldId}});
        }
      })
    }
  }


}
