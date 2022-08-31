
import { Location } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {NgbDatepicker, NgbDatepickerI18n, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { DateModel } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent implements OnInit {

  @ViewChild('newTaskModal' , {static:true}) newTaskModal:ElementRef|undefined;
  @ViewChild('TaskDetailModal' , {static:true}) TaskDetailModal:ElementRef|undefined;

  @ViewChild(NgbDatepicker, {static: true}) datepicker!: NgbDatepicker;

  // EventsList = [
  //   {
  //     id:1,
  //     title:"آبیاری",
  //     date:"2022-07-03",
  //   },
  //   {
  //     id:2,
  //     title:"کود پاشی",
  //     date:"2022-07-04",
  //   },
  //   {
  //     id:3,
  //     title:"نمونه برداری خاک",
  //     date:"2022-07-04",
  //   }
  // ]

  // AnalyzeList = [
  //   {
  //     id:1,
  //     title:"بررسی و تحلیل کود دهی",
  //     date:"2022-07-04",
  //   },
  //   {
  //     id:2,
  //     title:"پیشنهاد زمان آبیاری",
  //     date:"2022-07-15",
  //   }
  // ]


  firstDayDate!:string;
  endDayDate!:string;

  SelectedDay!:DateModel;
  SelectedDayTasks:any[] = [];

  fieldId!:number;
  fieldName!:string;
  // TasksList = [
  //   {
  //     taskTitle:'کاشت',
  //     taskTypes:[
  //       {
  //         typeTitle:'شخم (خاک‌ورزی)',
  //         typeId:null,
  //         fields:[
  //           {
  //             fieldTitle:'گاوآهن مورد استفاده',
  //             fieldItems:[
  //               "برگردان‌‌دار (سوك‌دار)",
  //               "بشقابي",
  //               "قلمي (چيزل)",
  //               "زيرشكن (ساب‌سويلر)",
  //               "تيلر (خاك‌شكن)",
  //               "هرس دندانه‌اي",
  //               "هرس بشقابي",
  //               "كولتيواتور"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         typeTitle:'کاشت محصول',
  //         typeId:null,
  //         fields:[
  //           {
  //             fieldTitle:'روش کاشت',
  //             fieldItems:[
  //               "بذركاري دستپاش",
  //               "بذركاري خطي",
  //               "بذركاري رديفي",
  //               "بذركاري كپه‌اي",
  //               "غده‌كاري",
  //               "نشاء‌كاري"
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     taskTitle:'داشت',
  //     taskTypes:[
  //       {
  //         typeTitle:'کوددهی',
  //         typeId:null,
  //         fields:[
  //           {
  //             fieldTitle:'نوع کود مورد استفاده',
  //             fieldItems:[
  //               "كود دامي",
  //               "كود آلي سبز",
  //               "كمپوست",
  //               "كود نيتروژن‌دار",
  //               "كود فسفر‌دار",
  //               "كود پتاسيم‌دار",
  //               "كود مخلوط",
  //               "كود ميكرو",
  //               "كود زيستي (بيولوژيكي)"
  //             ]
  //           },
  //           {
  //             fieldTitle:'مقدار کود (کیلوگرم)',
  //             valueUnit:2, //kilo geram
  //           }
  //         ]
  //       },
  //       {
  //         typeTitle:'سم پاشی',
  //         typeId:null,
  //         fields:[
  //           {
  //             fieldTitle:'نوع سم مورد استفاده',
  //             fieldItems:[
  //               "دلتامترین (Deltamethrin)",
  //               "آمیتراز (Amitraz)",
  //               "پرمترین (Permethrin)",
  //               "دیازینون (Diazinon)",
  //               "کلرپیریفوس (Chlorpyrifos)",
  //               "اندوسولفان (Endosulfan)",
  //               "اکسی‌دیمتون متیل (Oxydemeton-Methyl)",
  //               "سایپرمترین (Cypermethrin)",
  //               "فن‌پیروکسی میت (Fanpyroxymate)",
  //               "فن‌پروپاترین (Fenpropathrin)",
  //               "فن‌والریت (Fanvalerate)",
  //               "گلایفوزیت (Glyphosate)",
  //               "پاراکوات (Paraquat)",
  //             ]
  //           },
  //           {
  //             fieldTitle:'مقدار سم (لیتر)',
  //             valueUnit:1, //Litr

  //           }
  //         ]
  //       },
  //       {
  //         typeTitle:'آبیاری',
  //         typeId:null,
  //         fields:[]
  //       },
  //       {
  //         typeTitle:'وجین کردن',
  //         typeId:null,
  //         fields:[]
  //       },
  //       {
  //         typeTitle:'تنک کردن',
  //         typeId:null,
  //         fields:[]
  //       },
  //       {
  //         typeTitle:'خاک‌دهی پای بوته',
  //         typeId:null,
  //         fields:[]
  //       },
  //       {
  //         typeTitle:'واکاری',
  //         typeId:null,
  //         fields:[]
  //       }
  //     ]
  //   },
  //   {
  //     taskTitle:'برداشت',
  //     taskTypes:[
  //       {
  //         typeTitle:'برداشت محصول',
  //         typeId:null,
  //         fields:[]
  //       }
  //     ]
  //   },
  // ]

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

  SubmitedTasksList = [];


  constructor(
    public i18n: NgbDatepickerI18n,
    public dateTime:DateTimeService,
    private route:ActivatedRoute,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private gService:GeneralService
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
    this.getSubmitedTasksList();
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

  // dayHasAnalyze(date:DateModel){
  //   let gDate = this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day);
  //   let hasAnalyze = this.AnalyzeList.find(e=>(e.date==gDate));
  //   return !!hasAnalyze;
  // }

  getSelectedDateByFormat(date:string){
    
    return this.dateTime.toJalaliDateTimeCustomFormat(this.dateTime.toGeorgianDate(date) , 'YYYY-MM-DD' , 'MMM YYYY, dddd');
  }


  dayChanged(date:DateModel){
    this.SelectedDay = date;
    this.SelectedDayTasks = this.dayHasTask(date); 
    // this.getEvents();
    // this.getAnalyzis();
  }

  // getEvents(){
  //   this.SelectedDayEvents = 
  //     this.EventsList.filter(e=>e.date == this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay)));
  // }

  // getAnalyzis(){
  //   this.SelectedDayAnalyzis = 
  //     this.AnalyzeList.filter(a=>(a.date == this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay))));
  // }


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

    this.gService.post("v1/Activity/Add",this.TaskForm.value,{})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.getSubmitedTasksList();
            this.TaskForm.reset();
            this.gService.showSuccessToastr('فعالیت با موفقیت ثبت شد');
            this.modalService.dismissAll();
            
          }
        }
      )
  }

  getSubmitedTasksList(){
    this.gService.get("v1/Activity/GetList",{fieldId:this.fieldId , fromDate:this.firstDayDate , toDate:this.endDayDate})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.SubmitedTasksList = res.data;
            this.SelectedDayTasks = this.dayHasTask(this.SelectedDay); 
          }
        }
      )
  }

  TaskDetail:any;
  showTaskDetails(item:any){
    this.TaskDetail = item;
    this.modalService.open(this.TaskDetailModal , { centered: true , size: 'md'  });
  }
}