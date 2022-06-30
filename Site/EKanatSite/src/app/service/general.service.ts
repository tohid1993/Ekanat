import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// import { DateModel } from '../common/models';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  myAppUrl = '';
  eeUrl = '';

  // minDate: DateModel = { year: 1280, month: 1, day: 1 };
  // maxDate: DateModel = { year: 1410, month: 12, day: 30 };
  
  // private _DateTime = new BehaviorSubject<any>({});
  // DateTime = this._DateTime.asObservable();

  // serverTime:any;

  constructor(
    private http: HttpClient,
    private toastr:ToastrService,
    @Inject('BASE_URL') baseUrl: string,
    @Inject('EE_URL') eeUrl: string,
  ) {
    this.myAppUrl = baseUrl;
    this.eeUrl = eeUrl;
  }


  post(path:string , data:any , paramObj:any, resType:string="json" , eeService:boolean = false){
    // options
    const httpOptions = {
        params: {}
    };
    let params =new HttpParams();
    if (paramObj !== '' && paramObj !== undefined && paramObj !== null) {
        for (const property in paramObj) {
            if (paramObj.hasOwnProperty(property)) {
                params = params.append(property, paramObj[property].toString());
            }
        }
    }
    httpOptions.params = params;

    if(resType=="json")
      return this.http.post((eeService?this.eeUrl : this.myAppUrl) + path , data , httpOptions);
    else
      return this.http.post((eeService?this.eeUrl : this.myAppUrl) + path , data , {params:params , responseType:"text"})
  }

  postObservable<T>(path:string , data:any , paramObj:any , eeService:boolean = false):Observable<T>{
      // options
      const httpOptions = {
          params: {}
      };
      let params =new HttpParams();
      if (paramObj !== '' && paramObj !== undefined && paramObj !== null) {
          for (const property in paramObj) {
              if (paramObj.hasOwnProperty(property)) {
                  params = params.append(property, paramObj[property].toString());
              }
          }
      }
      httpOptions.params = params;

      return this.http.post<T>((eeService?this.eeUrl : this.myAppUrl)+path , data , httpOptions);
  }

  get( path: string , data: any , resType:string="json" , eeService:boolean = false){

    if(resType=="json"){
        const httpOptions = {
            params: {}
        };
        httpOptions.params = data;
        return this.http.get((eeService?this.eeUrl : this.myAppUrl) + path ,httpOptions)
    }else{
        return this.http.get((eeService?this.eeUrl : this.myAppUrl) + path ,{params:data , responseType:"text"})
    }

  }

  getObservable<T>(path: string ,data: any , eeService:boolean = false): Observable<T>{
      const httpOptions = {
          params: {}
      };
      httpOptions.params = data;
      return this.http.get<T>((eeService?this.eeUrl : this.myAppUrl) + path , httpOptions);
  }

  update( path: string , data: any , paramObj:any , eeService:boolean = false) {
    const httpOptions = {
        params: {}
    };
    let params =new HttpParams();
    if (paramObj !== '' && paramObj !== undefined && paramObj !== null) {
        for (const property in paramObj) {
            if (paramObj.hasOwnProperty(property)) {
                params = params.append(property, paramObj[property].toString());
            }
        }
    }
    httpOptions.params = params;
    return this.http.put((eeService?this.eeUrl : this.myAppUrl) + path, data , httpOptions);
  }

  delete(data: any, path: string , eeService:boolean = false) {
    const httpOptions = {
        params: {}
    };
    let params =new HttpParams();
    if (data !== '' && data !== undefined && data !== null) {
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
                params = params.append(property, data[property].toString());
            }
        }
    }
    httpOptions.params = params;
    return this.http.delete((eeService?this.eeUrl : this.myAppUrl)+path , httpOptions);
  }


  showSuccessToastr(msg:string){
    this.toastr.success(msg)
  }

  showErrorToastr(msg:string="خطایی رخ داده است.",title:string='خطا! '){
    this.toastr.error(msg,title)
  }

  showInfoToastr(msg:string){
    this.toastr.info(msg)
  }

  showWarningToastr(msg:string){
    this.toastr.warning(msg)
  }

  clone(obj:any) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }


}
