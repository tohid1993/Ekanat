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

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      private spinner: NgxSpinnerService,
      private gService:GeneralService,
      private auth:AuthService
    ) {      
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`,
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
              return throwError(error);
          })
      );
  }
   
       
  
  
}
