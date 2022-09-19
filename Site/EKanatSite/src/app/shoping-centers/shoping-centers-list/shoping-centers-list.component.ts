import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shoping-centers-list',
  templateUrl: './shoping-centers-list.component.html',
  styleUrls: ['./shoping-centers-list.component.scss']
})
export class ShopingCentersListComponent implements OnInit {

  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'https://l-lin.github.io/angular-datatables/data/data.json?_=1663608425859',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName',
        class: 'none'
      }],
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }

}
