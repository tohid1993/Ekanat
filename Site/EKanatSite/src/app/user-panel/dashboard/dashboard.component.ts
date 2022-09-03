import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  FieldsList:FieldsListVM[] = [];
  listLength:number = 4;

  constructor(
    private fieldService:FieldService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getFields();
  }

  getFields(){
    let self = this;
    this.fieldService.getFieldsList()
      .subscribe({
        next(res:any){
          self.FieldsList = res.data;
        }
      })
  }

  goToWeatherPage(fieldId:number){
    localStorage.setItem("selectedFieldId",fieldId.toString());
    this.router.navigate(['/weather'])
  }

  toggleShowList(){
    this.listLength = this.listLength==4? this.FieldsList.length : 4;
  }

}
