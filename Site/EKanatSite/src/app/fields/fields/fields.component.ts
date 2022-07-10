import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  constructor(
    private fieldService:FieldService
  ) { }

  FieldsList:FieldsListVM[] = [];

  // title:"مزرعه کلزا ینگنجه",
  // product:"کلزا",
  // area: 10,
  // cordinates:[
  //   [46.111152104515746, 38.173733033224856],

  FieldsShape:any[] = [];

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


}
