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
      ("getArea",{cords:coords},{},true)
  }

}
