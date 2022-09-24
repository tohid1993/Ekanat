import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.scss']
})
export class ForecastWeatherComponent implements OnInit {

  @Input("NextDaysWeather") NextDaysWeather:any|undefined;
  @Input("FieldId") FieldId:number|undefined;
  @Input("hasPackage") hasPackage:boolean = false;

  Math=Math;

  constructor(
    private dateTimeService:DateTimeService,
    private router:Router
  ) { }

  ngOnInit(): void {
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
        text:"برای دسترسی به امکانات بیشتر از جمله تحلیل شاخص ها و وضعیت آب و هوایی و ... ، باید برای این زمین کشاورزی پکیج استاندارد خریداری شود",
        icon:"warning",
        cancelButtonText:"متوجه شدم",
        confirmButtonText:"خرید پکیج",
        showCancelButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/package/invoice'],{queryParams:{fieldId:this.FieldId}});
        }
      })
    }
  }

}
