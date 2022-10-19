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

  getPastWeather(lat:number,lng:number,fromDate:string,toDate:string,fieldId:number){
    return this.gService.postObservable<any>
      ("v1/Fields/GetPastWeather",
      {
          lat:lat,
          lng:lng,
          fromDate:fromDate,
          toDate:toDate,
          fieldId:fieldId
      },{})
  }

  getIndicators(fieldId:number,type:IndicatorsTypes,fromDate:string,toDate:string,imageIndex:number = -1){
    return this.gService.post
      ("v1/Fields/RemoteSense",
      {
          fieldId:fieldId,
          type:type,
          fromDate:fromDate,
          toDate:toDate,
          imageIndex:imageIndex
      },{})
  }

  getLatLngFromXYarray(cords:any[]){
    let latlng:any[] = [];

    cords.forEach(cord => {
      latlng.push([cord.x,cord.y]);
    });

    return latlng;
  }

  getChart(fieldId:number,cords:any[],type:number){
    let date = new Date().toISOString();
    let dateString = date.split('T')[0]
    return this.gService.post("v1/Fields/GetChart",{
      fieldId: fieldId,
      type: type,
      cords:cords,
      toDate: dateString
    },{})
  }
}
