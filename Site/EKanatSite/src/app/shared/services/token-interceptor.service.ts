import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpRequest, HttpHandler,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from './general.service';
import { AuthService } from './auth.service';
import {TranslateService} from "./traslate.service";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      private spinner: NgxSpinnerService,
      private gService:GeneralService,
      private translateService:TranslateService,
      private auth:AuthService
    ) {      
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${this.auth.getToken()}`,
            Lang: this.translateService.locate || 'faIR'
        }
      });

      return next.handle(request).pipe(
          // retry(1),
          catchError((error: HttpErrorResponse) => {
              this.spinner.hide();

              if(error.status==400){
                if(error.error.StatusCode>0)
                  this.gService.showErrorToastr(error.error.Message);
                else  
                  this.gService.showErrorToastr("خطایی رخ داده است");
              }

              if(error.status==500){
                this.gService.showErrorToastr("سمت سرور مشکلی پیش آمده است ، مجدد تلاش نمایید");
              }
              return throwError(error);
          })
      );
  }
   
       
  
  
}
