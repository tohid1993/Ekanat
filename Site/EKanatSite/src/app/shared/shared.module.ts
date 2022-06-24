import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageBreadcrumbComponent } from './page-breadcrumb/page-breadcrumb.component';
import { FieldService } from './services/field.service';
import { FieldSvgComponent } from './field-svg/field-svg.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PageBreadcrumbComponent,
    FieldSvgComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports:[
    NgbModule,
    PageBreadcrumbComponent,
    FieldSvgComponent
  ],
  providers:[
    FieldService
  ]
})
export class SharedModule { }
