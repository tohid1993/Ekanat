import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      private spinner: NgxSpinnerService,
    ) {      
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // this.spinner.show();

    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer' //`Bearer ${this.auth.getToken()}`,
      }
    });
    return next.handle(request)
    .pipe(
      tap(
        ()=>{
          // this.spinner.hide();
        }
      )
    );
   
       
  }
  
}
