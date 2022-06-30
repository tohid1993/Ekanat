import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit {

  @Input('FieldLatLng')FieldLatLng: number[] | undefined;

  constructor(
    private http:HttpClient
  ) { }

  ngOnInit(): void {
    this.getCurrentWeather();
  }

  getCurrentWeather(){
    if(this.FieldLatLng)
      this.http.get("https://api.openweathermap.org/data/2.5/onecall",
        {
          headers:{
            'Content-Type':'application/json'
          },
          params:{
            appid:"85e1e6083125722b9ba2081c22d2609a",
            lat:this.FieldLatLng[0],
            lon:this.FieldLatLng[1],
            unit:'metric',
          }
        })
        .subscribe({
          next(res){console.log(res);
          },
          error(err){console.log(err);
          },
          complete(){}
        })
  }

}
