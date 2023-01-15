import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDatepicker, NgbDatepickerI18n, NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { DateModel, FieldsListVM } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { FieldService } from 'src/app/shared/services/field.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { TranslateService } from 'src/app/shared/services/traslate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(NgbDatepicker, {static: true}) datepicker!: NgbDatepicker;
  @ViewChild('TaskDetailModal' , {static:true}) TaskDetailModal:ElementRef|undefined;

  FieldsList:FieldsListVM[] = [];
  minLength:number = 5;
  SelectedDay!:DateModel;
  firstDayDate!:string;
  endDayDate!:string;
  SelectedDayTasks:any[] = [];
  SubmitedTasksList = [];

  startMonth!:DateModel;

  constructor(
    public i18n: NgbDatepickerI18n,
    private fieldService:FieldService,
    private router:Router,
    public dateTime:DateTimeService,
    private gService:GeneralService,
    private modalService: NgbModal,
    private translateService:TranslateService
  ) { }

  ngOnInit(): void {
    const {calendar} = this.datepicker;
    this.SelectedDay = calendar.getToday();
    this.startMonth = Object.assign({},this.SelectedDay);

    this.getFields();
    this.setStartEndDates();

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
    this.minLength = this.minLength==5? this.FieldsList.length : 5;
  }

  navigate(number: number) {
    const {state, calendar} = this.datepicker;

    let changeTo = calendar.getNext(state.firstDate, 'm', number)

    if(this.startMonth.year == changeTo.year && this.startMonth.month == (changeTo.month+1))
    {
      this.gService.showWarningToastr(this.translateService.translate('notAllowPreviousMonthData'));
      return;
    }

    this.datepicker.navigateTo(changeTo);
    this.dayChanged(changeTo);
    this.setStartEndDates();

  }

  today() {
    const {calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getToday());
  }

  dayChanged(date:DateModel){
    this.SelectedDay = date;
    this.SelectedDayTasks = this.dayHasTask(date); 
    // this.SelectedDayImages = this.dayHasImage(date); 
  }

  setStartEndDates(){
    this.firstDayDate = this.dateTime.toGeorgianDate(this.dateTime.modelToString({year:this.SelectedDay.year , month:this.SelectedDay.month , day:1}))
    this.endDayDate = this.dateTime.toGeorgianDate(this.dateTime.modelToString({year:this.SelectedDay.year , month:this.SelectedDay.month , day:(this.SelectedDay.month<=6?31:30)}))
    this.getSubmitedItemsList();
  }

  getSelectedDateByFormat(date:string){
    
    return this.dateTime.toJalaliDateTimeCustomFormat(this.dateTime.toGeorgianDate(date) , 'YYYY-MM-DD' , 'MMM YYYY, dddd');
  }

  dayHasTask(date:DateModel){
    let gDate = this.dateTime.toJalaliDate(this.dateTime.toGeorgianDate(date.year+"-"+date.month+"-"+date.day));
    let tasks = this.SubmitedTasksList.filter((task:any)=>(task.dateTime.substring(0,10)==gDate));
    
    return tasks;
  }

  getSubmitedItemsList(){
    this.gService.get("v1/Activity/GetList",{ fromDate:this.firstDayDate , toDate:this.endDayDate})
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