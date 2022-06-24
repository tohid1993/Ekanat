import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-breadcrumb',
  templateUrl: './page-breadcrumb.component.html',
  styleUrls: ['./page-breadcrumb.component.scss']
})
export class PageBreadcrumbComponent implements OnInit {

  @Input("pageTitle") pageTitle:string = "";

  @Input("backUrl") backUrl:string = "";


  constructor() { }

  ngOnInit(): void {
  }

}
