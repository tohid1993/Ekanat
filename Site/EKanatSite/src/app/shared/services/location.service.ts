import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeneralService } from './general.service';


@Injectable({
    providedIn: 'root'
})

export class LocationService {

    private _province = new BehaviorSubject<ProvinceSimpleViewModel[]>([]);
    province = this._province.asObservable();

    defaultCityId = new BehaviorSubject<number>(0);

    constructor(
        private gService:GeneralService,
    ) {}

    getProvince(justPublished:boolean=false){
        this.gService.getObservable<ProvinceSimpleViewModel[]>
        ("Province/getSimpleListAsync",{justPublished:justPublished})
        .subscribe(
            res=>{
                this._province.next(res);
            },error=>{
                this.gService.showErrorToastr(error.error.message);
            }
        )
    }

    setCityList(stateId:string,reset:boolean,field:any):any{
        if(reset)
            field.setValue('');

        this.province.subscribe(
            (res:any)=>{
                let state = res.find((s:any)=>s.id.toString()==stateId.toString());

                if(state){
                    return state.cities;
                }else{
                    if(res.length==0){
                        this.getProvince();
                        setTimeout(() => {
                            this.setCityList(stateId,reset,field);
                        }, 500);
                    }
                }
            }  
        );
    }

    setDefaultCityId(cityId:number){
        this.defaultCityId.next(cityId);
    }

    getVisionoCityList(){
        return this.gService.getObservable<any[]>
        ("City/getVisionoCityListAsync",{})
    }

    getPosition(): Promise<any>
    {
      return new Promise((resolve, reject) => {
  
        navigator.geolocation.getCurrentPosition(resp => {
  
            resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
          },
          err => {
            reject(err);
          });
      });

    }

    getCountriesCodes(){
        return this.gService.getObservable<any[]>
            ("v1/Countries/GetDropdown",{})
    }

}


export class ProvinceSimpleViewModel
{
    id!:number;
    name!:string;
    cities:CitySimpleViewModel[];

    constructor(){
        this.cities = [];
    }
}

export class CitySimpleViewModel
{
    id!:number;
    name!:string;
}



