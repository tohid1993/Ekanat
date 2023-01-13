import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import Swal from 'sweetalert2';
import {TranslateService} from "../../shared/services/traslate.service";

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.scss']
})
export class ForecastWeatherComponent implements OnInit , OnDestroy {

  @Input("NextDaysWeather") NextDaysWeather:any|undefined;
  @Input("FieldId") FieldId:number|undefined;
  @Input("hasPackage") hasPackage:boolean = false;

  Math=Math;

  needPackageMessage:string = ''
  dismissLabel:string = ''
  buyPackageLabel:string = ''

  translateUnsub:any

  constructor(
    private dateTimeService:DateTimeService,
    private router:Router,
    private translateService:TranslateService
  ) { }

  ngOnInit(): void {
    this.translateUnsub = this.translateService.data.subscribe({
      next:(data)=>{
        this.needPackageMessage = data['needPackageMessage']
        this.dismissLabel = data['dismissLabel']
        this.buyPackageLabel = data['buyPlane']
      }
    })
  }

  ngOnDestroy(): void {
    if(this.translateUnsub){
      this.translateUnsub.unsubscribe()
    }
  }

  getTime(timeStamp:number){
    let date =
      this.dateTimeService.toJalaliDateTimeCustomFormat(
        this.dateTimeService.timeStampToDateTime(timeStamp*1000) , "M/D/YYYY HH:mm:ss" , "dddd D MMM YYYY"
      );        

    return date;
  }

  showPackageAlert(){
    if(!this.hasPackage){
      Swal.fire({
        // title:"",
        text:this.needPackageMessage,
        icon:"warning",
        cancelButtonText:this.dismissLabel,
        confirmButtonText:this.buyPackageLabel,
        showCancelButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/package/invoice'],{queryParams:{fieldId:this.FieldId}});
        }
      })
    }
  }

}
