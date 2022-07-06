import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { ToastrModule } from 'ngx-toastr';

import { FieldSvgComponent } from './field-svg/field-svg.component';
import { PageBreadcrumbComponent } from './page-breadcrumb/page-breadcrumb.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { DateTimeService } from './services/dateTime.service';
import { FieldService } from './services/field.service';
import { FileService } from './services/file.service';
import { GeneralService } from './services/general.service';
import { TokenInterceptor } from './services/token-interceptor.service';
import { UserService } from './services/user.service';


@NgModule({
  declarations: [
    PageBreadcrumbComponent,
    FieldSvgComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    NgbModule,
  ],
  exports:[
    PageBreadcrumbComponent,
    FieldSvgComponent,
    HttpClientModule,
    NgxEchartsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[
    FieldService,
    FileService,
    GeneralService,
    AuthGuard,
    AuthService,
    UserService,
    DateTimeService,
    NgbModalConfig, 
    NgbModal,
    TokenInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ]
})
export class SharedModule { }
