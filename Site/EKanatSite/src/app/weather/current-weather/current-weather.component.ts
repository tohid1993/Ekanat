import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DateTimeService } from 'src/app/service/dateTime.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit {

  @Input('FieldLatLng')FieldLatLng: number[] | undefined;

  CurrentWeather:any|undefined;
  NextHoursWeather:any|undefined;
  NextDaysWeather:any|undefined;

  Math=Math;

  CurrentDateTime:string|undefined;

  constructor(
    private http:HttpClient,
    private dateTimeService:DateTimeService
  ) { }

  ngOnInit(): void {
    this.getCurrentWeather();
  }

  getCurrentWeather(){
    let self = this;

    if(this.FieldLatLng)
      this.http.get("http://api.openweathermap.org/data/2.5/onecall",
        {
          headers:{
            'Content-Type':'application/json'
          },
          params:{
            appid:"85e1e6083125722b9ba2081c22d2609a",
            lat:this.FieldLatLng[0],
            lon:this.FieldLatLng[1],
            units:'metric',
          }
        })
        .subscribe({
          next(res:any){
              self.CurrentWeather = res.current;
              self.NextHoursWeather = res.hourly;
              self.NextDaysWeather = res.daily;

              self.CurrentDateTime =
               self.dateTimeService.toJalaliDateTimeCustomFormat(
                self.dateTimeService.timeStampToDateTime(self.CurrentWeather.dt*1000) , "M/D/YYYY HH:mm:ss" , "dddd M MMM YYYY - HH:mm"
              )
          },
          error(err){console.log(err);
          },
          complete(){}
        })
  }

  getTime(timeStamp:number){
    let time = new Date(timeStamp*1000);
    return time.toLocaleTimeString('en-US',{hour12:false}).substring(0,5);
  }
}
