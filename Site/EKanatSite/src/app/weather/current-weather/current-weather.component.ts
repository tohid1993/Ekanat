import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DateTimeService } from 'src/app/service/dateTime.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit {

  @Input('CurrentWeather')CurrentWeather: any|undefined;
  @Input('NextHoursWeather')NextHoursWeather: any|undefined;

  Math=Math;

  CurrentDateTime:string|undefined;

  constructor(
    private dateTimeService:DateTimeService
  ) { }

  ngOnInit(): void {
    this.CurrentDateTime =
      this.dateTimeService.toJalaliDateTimeCustomFormat(
      this.dateTimeService.timeStampToDateTime(this.CurrentWeather.dt*1000) , "M/D/YYYY HH:mm:ss" , "dddd D MMM YYYY - HH:mm"
    );
  }



  getTime(timeStamp:number){
    let time = new Date(timeStamp*1000);
    return time.toLocaleTimeString('en-US',{hour12:false}).substring(0,5);
  }
}
