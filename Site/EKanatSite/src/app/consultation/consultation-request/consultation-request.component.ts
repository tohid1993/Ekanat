import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/shared/services/general.service';
import {TranslateService} from "../../shared/services/traslate.service";
import {DateTimeService} from "../../shared/services/dateTime.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileViewModel} from "../../shared/models/model";
import {FieldService} from "../../shared/services/field.service";
import {FileService} from "../../shared/services/file.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-consultation-request',
  templateUrl: './consultation-request.component.html',
  styleUrls: ['./consultation-request.component.scss']
})
export class ConsultationRequestComponent implements OnInit {

  ConsultationForm:FormGroup;

  Fields:any[] = []
    Subjects:any[] = []

  constructor(
    private gService:GeneralService,
    public translateService:TranslateService,
    public dateTime:DateTimeService,
    private fieldService:FieldService,
    public fileService:FileService,
    private spinner:NgxSpinnerService,

  ){
    this.ConsultationForm = new FormGroup(
        {
          subjectId:new FormControl(null,[Validators.required]),
          fieldId:new FormControl(null,[Validators.required]),
          description:new FormControl(null,[Validators.required]),
          file:new FormControl(new FileViewModel()),
        }
    )
  }

  ngOnInit(): void {
    this.fieldService.getFieldsList().subscribe({
        next:(res:any)=>{
            if(res.isSuccess && res.data){
                this.Fields = res.data
            }
        }
    })

      this.fieldService.getConsultationSubjects().subscribe({
          next:(res:any)=>{
              if(res.isSuccess && res.data){
                  this.Subjects = res.data
              }
          }
      })
  }

    sendRequest(){
        if(this.ConsultationForm.invalid) return;

        this.spinner.show();
        let self = this;
        this.fieldService.setConsultation(this.ConsultationForm.value)
            .subscribe({
                complete(){
                    self.spinner.hide();
                    self.ConsultationForm.reset()
                    self.gService.showSuccessToastr(self.translateService.translate('newConsultationSubmitted'));
                }
            })
    }

    clearFile(e:any){
        this.ConsultationForm.controls['file'].setValue(new FileViewModel())
        e.preventDefault();
    }


}
