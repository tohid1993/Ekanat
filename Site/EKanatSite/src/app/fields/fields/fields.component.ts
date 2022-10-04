import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  constructor(
    private fieldService:FieldService,
    private gService:GeneralService,
    private router:Router
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

  goToFieldDetail(field:FieldsListVM){
    this.router.navigate(['/fields/imagery/analytics',field.id])
  }

  deleteField(e:Event,field:FieldsListVM){
    e.stopPropagation();
    Swal.fire({
      text:`آیا مطمن به حذف زمین "${field.name}" میباشد؟`,
      cancelButtonText:'خیر',
      showCancelButton:true,
      confirmButtonText:'بله'
    }).then((res)=>{
      if(res.isConfirmed){
    this.fieldService.deleteField(field.id)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.gService.showSuccessToastr('زمین با موفقیت حذف شد')
            this.getFields();
          }
        }
      })
      }
    })

  }


}
