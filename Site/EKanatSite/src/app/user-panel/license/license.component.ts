import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {

  isDotCom:boolean = false;
  isDotIr:boolean = false;

  showLicense:boolean = false

  constructor() { }

  ngOnInit(): void {
    if(window.location.host=="ekanat.ir") this.isDotIr = true;
    if(window.location.host=="ekanat.com") this.isDotCom = true;
  }

}
