import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import Swal from 'sweetalert2';
import {TranslateService} from "../../shared/services/traslate.service";

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit , OnDestroy {
  FieldsList:FieldsListVM[] = [];

  translateUnsub:any;
  yesLabel:string = ''
  noLabel:string = ''
  fieldRemoveSuccessMessage:string = ''
  fieldRemoveAlertTemplate:string = ''

  constructor(
    private fieldService:FieldService,
    private gService:GeneralService,
    private router:Router,
    public translateService:TranslateService
  ) { }

  ngOnDestroy(): void {
    if(this.translateUnsub)
      this.translateUnsub.unsubscribe()
  }

  ngOnInit(): void {
    this.translateUnsub = this.translateService.data.subscribe({
      next:(data)=>{
        this.yesLabel = data['yesLabel'] || 'yesLabel'
        this.noLabel = data['noLabel'] || 'noLabel'
        this.fieldRemoveSuccessMessage = data['fieldRemoveSuccessMessage'] || 'fieldRemoveSuccessMessage'
        this.fieldRemoveAlertTemplate = data['fieldRemoveAlertTemplate'] || 'fieldRemoveAlertTemplate'
      }
    })
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

    let alertMessage = this.fieldRemoveAlertTemplate.replace('fieldName',field.name)

    Swal.fire({
      text:alertMessage,
      cancelButtonText:this.noLabel,
      showCancelButton:true,
      confirmButtonText:this.yesLabel
    }).then((res)=>{
      if(res.isConfirmed){
    this.fieldService.deleteField(field.id)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.gService.showSuccessToastr(this.fieldRemoveSuccessMessage)
            this.getFields();
          }
        }
      })
      }
    })

  }


}
