import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable , of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { StartupService } from './startup.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      public auth: AuthService,
      private toastr:ToastrService,
      private http:HttpClient,
      private startup:StartupService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          SessionId:this.startup.getSessionId || ''
        }
      });
      return next.handle(request)
      .pipe(
        tap(
          event => {},
          error => {

            if(error.status==401){
              localStorage.clear();
              window.location.href="/login";
            }

            if(error.status==0){
              this.toastr.error('ارتباط اینترنت خود را بررسی کنید.')
            }
          }
        )
      );
     
         
    }
}
