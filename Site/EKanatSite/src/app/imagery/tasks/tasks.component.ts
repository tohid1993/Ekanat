
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbDatepicker, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { DateModel } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent implements OnInit {


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

  constructor(
    public i18n: NgbDatepickerI18n,
    public dateTime:DateTimeService  
  ) {}

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
}