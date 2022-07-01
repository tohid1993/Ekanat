import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageBreadcrumbComponent } from './page-breadcrumb/page-breadcrumb.component';
import { FieldService } from './services/field.service';
import { FieldSvgComponent } from './field-svg/field-svg.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { GeneralService } from '../service/general.service';
import { DateTimeService } from '../service/dateTime.service';


@NgModule({
  declarations: [
    PageBreadcrumbComponent,
    FieldSvgComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  exports:[
    NgbModule,
    PageBreadcrumbComponent,
    FieldSvgComponent,
    HttpClientModule
  ],
  providers:[
    FieldService,
    GeneralService,
    DateTimeService,
    NgbModalConfig, 
    NgbModal
  ]
})
export class SharedModule { }
