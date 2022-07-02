import { Component, Input, OnInit } from '@angular/core';
import { DateTimeService } from 'src/app/service/dateTime.service';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.scss']
})
export class ForecastWeatherComponent implements OnInit {

  @Input("NextDaysWeather") NextDaysWeather:any|undefined;

  Math=Math;

  constructor(
    private dateTimeService:DateTimeService
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

}
