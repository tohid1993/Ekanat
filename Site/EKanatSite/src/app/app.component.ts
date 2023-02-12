import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbCalendar, NgbCalendarPersian, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from './shared/services/user.service';
import {Router} from '@angular/router';
import {TranslateService} from "./shared/services/traslate.service";


const WEEKDAYS_SHORT = ['دوشنبه', 'سه‌شنبه', 'چهار‌شنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یک‌شنبه'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayLabel(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:
      (localStorage.getItem('siteLang')||'faIR')==='faIR'?
      [
        {provide: NgbCalendar, useClass: NgbCalendarPersian},
        {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
      ]:[]
})
export class AppComponent implements OnInit {
  title = 'EKanatSite';
  siteLang:string = 'faIR'

  constructor(
    private spinner: NgxSpinnerService,
    private userService:UserService,
    private translateService:TranslateService,
    private router:Router
    ){
  }
  ngOnInit(): void {
      this.translateService.init(localStorage.getItem('siteLang') || this.siteLang)

      document.querySelector("html")!.setAttribute('lang',this.translateService.locate.substring(0,2))
      document.querySelector("html")!.setAttribute('dir',this.translateService.siteDir)

      document.getElementById('bootstrap-style')!
          .setAttribute('href',this.translateService.siteDir==='rtl'?'./assets/css/bootstrap.rtl.min.css':'./assets/css/bootstrap.min.css')

      this.userService.isAuth.subscribe
      ({
        next:(res:any)=>{
          if(res==true){
            this.userService.loadUserDetails();
          }else{
            if(this.router.url!='/' && this.router.url!='/home')
              this.router.navigate(['/login']);
          }
        }
      })

  }
}
