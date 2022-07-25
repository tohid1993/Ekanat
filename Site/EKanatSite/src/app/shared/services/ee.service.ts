import { Injectable } from '@angular/core';
import { IndicatorsTypes } from '../models/model';
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

  getIndicators(type:IndicatorsTypes,cords:any[],fromDate:string,toDate:string){

    let api = "";

    switch (type) {
      case IndicatorsTypes.ndvi:
        api = "ndvi";
        break;

      case IndicatorsTypes.ndre:
        api = "ndre";
        break;

      case IndicatorsTypes.reci:
        api = "reci";
        break;

      case IndicatorsTypes.sipi:
        api = "sipi";
        break;

      case IndicatorsTypes.vari:
        api = "vari";
        break;  

      case IndicatorsTypes.evi:
        api = "evi";
        break; 
        
      case IndicatorsTypes.arvi:
        api = "arvi";
        break;  
      default:
        break;
    }

    return this.gService.post
      (api,
      {
          type:type,
          cords:cords,
          fromDate:fromDate,
          toDate:toDate
      },{},'text',true)
  }

  getLatLngFromXYarray(cords:any[]){
    let latlng:any[] = [];

    cords.forEach(cord => {
      latlng.push([cord.x,cord.y]);
    });

    return latlng;
  }
}
