
import { Location } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgbDatepicker, NgbDatepickerI18n, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { DateModel } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent implements OnInit {

  @ViewChild('newTaskModal' , {static:true}) newTaskModal:ElementRef|undefined;

  @ViewChild(NgbDatepicker, {static: true}) datepicker!: NgbDatepicker;

  EventsList = [
    {
      id:1,
      title:"آبیاری",
      date:"2022-07-03",
    },
    {
      id:2,
      title:"کود پاشی",
      date:"2022-07-04",
    },
    {
      id:3,
      title:"نمونه برداری خاک",
      date:"2022-07-04",
    }
  ]

  AnalyzeList = [
    {
      id:1,
      title:"بررسی و تحلیل کود دهی",
      date:"2022-07-04",
    },
    {
      id:2,
      title:"پیشنهاد زمان آبیاری",
      date:"2022-07-15",
    }
  ]

  SelectedDay!:DateModel;
  SelectedDayEvents:any[] = [];
  SelectedDayAnalyzis:any = [];

  fieldId!:number;

  TasksList = [
    {
      taskTitle:'کاشت',
      taskTypes:[
        {
          typeTitle:'شخم (خاک‌ورزی)',
          fields:[
            {
              fieldTitle:'گاوآهن مورد استفاده',
              fieldItems:[
                "برگردان‌‌دار (سوك‌دار)",
                "بشقابي",
                "قلمي (چيزل)",
                "زيرشكن (ساب‌سويلر)",
                "تيلر (خاك‌شكن)",
                "هرس دندانه‌اي",
                "هرس بشقابي",
                "كولتيواتور"
              ]
            }
          ]
        },
        {
          typeTitle:'کاشت محصول',
          fields:[
            {
              fieldTitle:'روش کاشت',
              fieldItems:[
                "بذركاري دستپاش",
                "بذركاري خطي",
                "بذركاري رديفي",
                "بذركاري كپه‌اي",
                "غده‌كاري",
                "نشاء‌كاري"
              ]
            }
          ]
        }
      ]
    },
    {
      taskTitle:'داشت',
      taskTypes:[
        {
          typeTitle:'کوددهی',
          fields:[
            {
              fieldTitle:'نوع کود مورد استفاده',
              fieldItems:[
                "كود دامي",
                "كود آلي سبز",
                "كمپوست",
                "كود نيتروژن‌دار",
                "كود فسفر‌دار",
                "كود پتاسيم‌دار",
                "كود مخلوط",
                "كود ميكرو",
                "كود زيستي (بيولوژيكي)"
              ]
            },
            {
              fieldTitle:'مقدار کود (کیلوگرم)'
            }
          ]
        },
        {
          typeTitle:'سم‌پاشی',
          fields:[
            {
              fieldTitle:'نوع سم مورد استفاده',
              fieldItems:[
                "دلتامترین (Deltamethrin)",
                "آمیتراز (Amitraz)",
                "پرمترین (Permethrin)",
                "دیازینون (Diazinon)",
                "کلرپیریفوس (Chlorpyrifos)",
                "اندوسولفان (Endosulfan)",
                "اکسی‌دیمتون متیل (Oxydemeton-Methyl)",
                "سایپرمترین (Cypermethrin)",
                "فن‌پیروکسی میت (Fanpyroxymate)",
                "فن‌پروپاترین (Fenpropathrin)",
                "فن‌والریت (Fanvalerate)",
                "گلایفوزیت (Glyphosate)",
                "پاراکوات (Paraquat)",
              ]
            },
            {
              fieldTitle:'مقدار سم (لیتر)'
            }
          ]
        },
        {
          typeTitle:'آبیاری',
          fields:[]
        },
        {
          typeTitle:'وجین کردن',
          fields:[]
        },
        {
          typeTitle:'تنک کردن',
          fields:[]
        },
        {
          typeTitle:'خاک‌دهی پای بوته',
          fields:[]
        },
        {
          typeTitle:'واکاری',
          fields:[]
        }
      ]
    },
    {
      taskTitle:'برداشت',
      taskTypes:[
        {
          typeTitle:'برداشت محصول',
          fields:[]
        }
      ]
    },
  ]
  goToSubmitNewTask:boolean = false;
  SelectedTaskType:string = '';
  SelectedTaskFieldsList:any[] = [];

  constructor(
    public i18n: NgbDatepickerI18n,
    public dateTime:DateTimeService,
    private route:ActivatedRoute,
    config: NgbModalConfig, 
    private modalService: NgbModal,
  ) {
    this.route.params.subscribe(params=>{this.fieldId = params['id']});
    config.keyboard = false;
  }

  ngOnInit(): void {
    const {calendar} = this.datepicker;
    this.SelectedDay = calendar.getToday(); 
  }

  navigate(number: number) {
    const {state, calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getNext(state.firstDate, 'm', number));

    this.dayChanged(calendar.getNext(state.firstDate, 'm', number))
  }

  today() {
    const {calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getToday());
  }

  dayHasEvent(date:DateModel){
    let gDate = this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day);
    let hasEvent = this.EventsList.find(e=>(e.date==gDate));
    return !!hasEvent;
  }

  dayHasAnalyze(date:DateModel){
    let gDate = this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day);
    let hasAnalyze = this.AnalyzeList.find(e=>(e.date==gDate));
    return !!hasAnalyze;
  }

  getSelectedDateByFormat(date:string){
    
    return this.dateTime.toJalaliDateTimeCustomFormat(this.dateTime.toGeorgianDate(date) , 'YYYY-MM-DD' , 'MMM YYYY, dddd');
  }


  dayChanged(date:DateModel){
    this.SelectedDay = date;
    this.getEvents();
    this.getAnalyzis();
  }

  getEvents(){
    this.SelectedDayEvents = 
      this.EventsList.filter(e=>e.date == this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay)));
  }

  getAnalyzis(){
    this.SelectedDayAnalyzis = 
      this.AnalyzeList.filter(a=>(a.date == this.dateTime.toGeorgianDate(this.dateTime.modelToString(this.SelectedDay))));
  }


  getTaskFields(){
    this.SelectedTaskFieldsList = [];

    for (let taskIndex = 0; taskIndex < this.TasksList.length; taskIndex++) {
      for (let typeIndex = 0; typeIndex < this.TasksList[taskIndex].taskTypes.length; typeIndex++) {
        if(this.TasksList[taskIndex].taskTypes[typeIndex].typeTitle == this.SelectedTaskType){
          this.SelectedTaskFieldsList = this.TasksList[taskIndex].taskTypes[typeIndex].fields;
          break;
        } 
      } 
    }
  }

  goToNewTask(){
    this.modalService.open(this.newTaskModal , { centered: true , size: 'md'  });
  }
}