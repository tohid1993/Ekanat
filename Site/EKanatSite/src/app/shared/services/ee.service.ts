import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class EeService {

  constructor(
    private gService:GeneralService
  ) { }


  calcArea(coords:any[]){
    return this.gService.postObservable<any>
      ("v1/Fields/GetArea",{cords:coords},{})
  }

  getPastWeather(lat:number,lng:number,fromDate:string,toDate:string){
    return this.gService.postObservable<any>
      ("v1/Fields/GetPastWeather",
      {
          lat:lat,
          lng:lng,
          fromDate:fromDate,
          toDate:toDate
      },{})
  }

  getNdvi(cords:any[],fromDate:string,toDate:string){
    return this.gService.postObservable<any>
      ("ndvi",
      {
          cords:cords,
          fromDate:fromDate,
          toDate:toDate
      },{},true)
  }

  getLatLngFromXYarray(cords:any[]){
    let latlng:any[] = [];

    cords.forEach(cord => {
      latlng.push([cord.x,cord.y]);
    });

    return latlng;
  }
}
