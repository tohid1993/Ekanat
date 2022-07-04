import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { ToastrModule } from 'ngx-toastr';
import { DateTimeService } from '../service/dateTime.service';
import { GeneralService } from '../service/general.service';
import { TokenInterceptor } from '../service/token-interceptor.service';
import { FieldSvgComponent } from './field-svg/field-svg.component';
import { PageBreadcrumbComponent } from './page-breadcrumb/page-breadcrumb.component';
import { FieldService } from './services/field.service';


@NgModule({
  declarations: [
    PageBreadcrumbComponent,
    FieldSvgComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    NgbModule
  ],
  exports:[
    PageBreadcrumbComponent,
    FieldSvgComponent,
    HttpClientModule,
    NgxEchartsModule,
    NgbModule
  ],
  providers:[
    FieldService,
    GeneralService,
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
