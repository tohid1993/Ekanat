
import { Location } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {NgbDatepicker, NgbDatepickerI18n, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { DateModel } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { FileService } from 'src/app/shared/services/file.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent implements OnInit {

  @ViewChild('newTaskModal' , {static:true}) newTaskModal:ElementRef|undefined;
  @ViewChild('newImageModal' , {static:true}) newImageModal:ElementRef|undefined;
  @ViewChild('TaskDetailModal' , {static:true}) TaskDetailModal:ElementRef|undefined;
  @ViewChild('ImageDetailModal' , {static:true}) ImageDetailModal:ElementRef|undefined;

  

  @ViewChild(NgbDatepicker, {static: true}) datepicker!: NgbDatepicker;

  


  firstDayDate!:string;
  endDayDate!:string;

  SelectedDay!:DateModel;
  SelectedDayTasks:any[] = [];
  SelectedDayImages:any[] = [];

  fieldId!:number;
  fieldName!:string;

  ActivityList:any[] = [];

  goToSubmitNewTask:boolean = false;
  SelectedActivity:any;


  TaskForm = new FormGroup({
    fieldId: new FormControl(null,[Validators.required]),
    dateTime: new FormControl(null,[Validators.required]),
    activityGroupId: new FormControl(null,[Validators.required]),
    activityGroupTypeId: new FormControl(null,[]),
    value: new FormControl(null,[]),
    valueUnit: new FormControl(null,[]),
    description: new FormControl(null,[])
  })

  ImageForm = new FormGroup({
    fieldId: new FormControl(null,[Validators.required]),
    takeFileDateTime: new FormControl(null,[Validators.required]),
    title: new FormControl(null,[Validators.required]),
    file: new FormControl(null,[Validators.required]),
    description: new FormControl(null,[])
  })

  SubmitedTasksList = [];
  SubmitedImagesList = [];
  inProcess:boolean = false;

  constructor(
    public i18n: NgbDatepickerI18n,
    public dateTime:DateTimeService,
    private route:ActivatedRoute,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private gService:GeneralService,
    public fileService:FileService
  ) {
    this.route.params.subscribe(
      params=>{
        this.fieldId = params['id'],
        this.fieldName = params['name']
      });
    config.keyboard = false;
  }

  ngOnInit(): void {
    const {calendar} = this.datepicker;
    this.SelectedDay = calendar.getToday();
        
    this.setStartEndDates();
    this.getActivityGroups(); 
  }

  setStartEndDates(){
    this.firstDayDate = this.dateTime.toGeorgianDate(this.dateTime.modelToString({year:this.SelectedDay.year , month:this.SelectedDay.month , day:1}))
    this.endDayDate = this.dateTime.toGeorgianDate(this.dateTime.modelToString({year:this.SelectedDay.year , month:this.SelectedDay.month , day:(this.SelectedDay.month<=6?31:30)}))
    this.getSubmitedItemsList();
  }

  navigate(number: number) {
    const {state, calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getNext(state.firstDate, 'm', number));

    this.dayChanged(calendar.getNext(state.firstDate, 'm', number));
    this.setStartEndDates();

  }

  today() {
    const {calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getToday());
  }

  dayHasTask(date:DateModel){
    let gDate = this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day);
    let tasks = this.SubmitedTasksList.filter((task:any)=>(task.dateTime.substring(0,10)==gDate));
    
    return tasks;
  }

  dayHasImage(date:DateModel){
    let gDate = this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day);
    let images = this.SubmitedImagesList.filter((image:any)=>(this.dateTime.toGeorgianDate(image.takeFileDateTime.substring(0,10))==gDate));
    
    return images;
  }


  getSelectedDateByFormat(date:string){
    
    return this.dateTime.toJalaliDateTimeCustomFormat(this.dateTime.toGeorgianDate(date) , 'YYYY-MM-DD' , 'MMM YYYY, dddd');
  }


  dayChanged(date:DateModel){
    this.SelectedDay = date;
    this.SelectedDayTasks = this.dayHasTask(date); 
    this.SelectedDayImages = this.dayHasImage(date); 
  }

 

  getTaskFields(){
    this.SelectedActivity = undefined;
    
    this.TaskForm.controls['activityGroupTypeId'].setValue(null);
    this.TaskForm.controls['activityGroupTypeId'].clearValidators();
    this.TaskForm.controls['value'].setValue(null);
    this.TaskForm.controls['value'].clearValidators();
    this.TaskForm.controls['valueUnit'].setValue(null);
    this.TaskForm.controls['valueUnit'].clearValidators();


    this.SelectedActivity = this.ActivityList.find((a:any)=>(a.id == this.TaskForm.value.activityGroupId));
    if(this.SelectedActivity){

      if(this.SelectedActivity.types.length>0){
        this.TaskForm.controls['activityGroupTypeId'].setValidators([Validators.required]);
      }
      if(this.SelectedActivity['hasValue']){
        this.TaskForm.controls['value'].setValidators([Validators.required]);
      }
      if(this.SelectedActivity['hasValueUnit']){
        this.TaskForm.controls['valueUnit'].setValidators([Validators.required]);
      }
    }

    this.TaskForm.controls['activityGroupTypeId'].updateValueAndValidity();
    this.TaskForm.controls['value'].updateValueAndValidity();
    this.TaskForm.controls['valueUnit'].updateValueAndValidity();
  }

  goToNewTask(){
    this.TaskForm.controls['dateTime'].setValue(
      this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay))
    );
    this.TaskForm.controls['fieldId'].setValue(+this.fieldId);
    this.modalService.open(this.newTaskModal , { centered: true , size: 'md'  });
  }

  goToNewImage(){
    this.ImageForm.controls['takeFileDateTime'].setValue(
      this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay))
    );
    this.ImageForm.controls['fieldId'].setValue(+this.fieldId);
    this.modalService.open(this.newImageModal , { centered: true , size: 'md'  });
  }

  getActivityGroups(){
    this.gService.get("v1/ActivityGroups/GetDropdownList",{})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.ActivityList = res.data;
          }
        }
      )
  }

  sendTask(){
    if(this.TaskForm.invalid) return;
    this.inProcess = true;
    this.gService.post("v1/Activity/Add",this.TaskForm.value,{})
      .subscribe(
       {
        next:(res:any)=>{
            if(res.isSuccess){
              this.getSubmitedItemsList();
              this.TaskForm.reset();
              this.gService.showSuccessToastr('فعالیت با موفقیت ثبت شد');
              this.modalService.dismissAll();
              this.inProcess = false;
            }
        },
        error:()=>{
          this.inProcess = false;
        }
       }
      )
  }

  

  removeTask(task:any){
   Swal.fire({
    icon:'warning',
    text:`آیا از حذف فعالیت ${task.activityGroupName} مطمن هستید؟`,
    showCancelButton:true,
    cancelButtonText:"خیر",
    showConfirmButton:true,
    confirmButtonText:'بله'
   }).
    then(res=>{
      if(res.isConfirmed){
        this.gService.delete({activityId:task.id},"v1/Activity/Delete")
          .subscribe({
            next:(res:any)=>{
              if(res.isSuccess){
                this.gService.showSuccessToastr("فعالیت با موفقیت حذف شد");
                this.getSubmitedItemsList();
              }
            }
          })
      }
      
    })
  }

  removeFile(file:any){
    Swal.fire({
     icon:'warning',
     text:`آیا از حذف فایل ${file.title} مطمن هستید؟`,
     showCancelButton:true,
     cancelButtonText:"خیر",
     showConfirmButton:true,
     confirmButtonText:'بله'
    }).
     then(res=>{
       if(res.isConfirmed){
         this.gService.delete({fieldFileId:file.id},"v1/Fields/DeleteFieldFile")
           .subscribe({
             next:(res:any)=>{
               if(res.isSuccess){
                 this.gService.showSuccessToastr("فایل با موفقیت حذف شد");
                 this.getSubmitedItemsList();
               }
             }
           })
       }
       
     })
   }

  getSubmitedItemsList(){
    this.gService.get("v1/Activity/GetList",{fieldId:this.fieldId , fromDate:this.firstDayDate , toDate:this.endDayDate})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.SubmitedTasksList = res.data;
            this.SelectedDayTasks = this.dayHasTask(this.SelectedDay); 
          }
        }
      )


    this.gService.get("v1/Fields/GetFieldFiles",{fieldId:this.fieldId , fromDate:this.firstDayDate , toDate:this.endDayDate})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.SubmitedImagesList = res.data;
            this.SelectedDayImages = this.dayHasImage(this.SelectedDay); 
          }
        }
      )
  }

  TaskDetail:any;
  showTaskDetails(item:any){
    this.TaskDetail = item;
    this.modalService.open(this.TaskDetailModal , { centered: true , size: 'md'  });
  }


  ImageDetail:any;
  showImageDetails(item:any){
    this.ImageDetail = item;
    this.modalService.open(this.ImageDetailModal , { centered: true , size: 'md'  });
  }


  sendImage(){
    if(this.ImageForm.invalid) return;
    this.inProcess = true;
    this.gService.post("v1/Fields/UploadFile",this.ImageForm.value,{})
      .subscribe(
       {
        next:(res:any)=>{
            if(res.isSuccess){
              this.getSubmitedItemsList();
              this.ImageForm.reset();
              this.gService.showSuccessToastr('تصویر با موفقیت ثبت شد');
              this.modalService.dismissAll();
              this.inProcess = false;
            }
        },
        error:()=>{
          this.inProcess = false;
        }
       }
      )
  }
}