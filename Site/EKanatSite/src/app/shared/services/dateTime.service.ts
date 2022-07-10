import * as moment from 'jalali-moment';
import { formatDate } from '@angular/common';
import { DateModel } from '../models/model';
// import { DateModel } from '../common/models';


export class DateTimeService {


  constructor() {
  }

  /**
   * تبدیل تاریخ به شمسی
   * @param date تاریخ میلادی به صورت استرینگ
   */
  toJalaliDate(date?:string)
  {
      if(date)
      {
        // moment.locale('fa');

        let strDate = '';
        if(date.indexOf('T') > 0){
          let d = date.split('T');
          strDate = d[0];
        }
        else{
          let d = date.split(' ');
          strDate = d[0];
        }

        return moment(strDate, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
      }
      return '';
  }

  /**
   * تبدیل تاریخ و ساعت به شمسی
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  toJalaliDateTime(date:string , format:string = "YYYY-M-D HH:mm:ss")
  {
    let dt =  moment(date, format)
      .locale('fa')
      .format('YYYY/M/D HH:mm:ss');

    return dt;
  }


    /**
   * تبدیل تاریخ و ساعت به شمسی
   * @param date تاریخ و ساعت به صورت استرینگ
   */
    toJalaliDateTimeCustomFormat(date:string , format:string = "YYYY-M-D HH:mm:ss" , outPutFormat:string = "YYYY/M/D HH:mm:ss")
    {
      let dt =  moment(date, format)
        .locale('fa')
        .format(outPutFormat);
      return dt;
    }


  /**
   * تبدیل تاریخ به میلادی
   * @param date تاریخ شمسی به صورت استرینگ
   */
  toGeorgianDate(date?:string)
  {

    if(date)
    {
      moment.locale('en');

      let strDate = '';
      if(date.indexOf('T') > 0){
        let d = date.split('T');
        strDate = d[0];
      }
      else{
        let d = date.split(' ');
        strDate = d[0];
      }

      return moment.from(strDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    return '';

  
  }


  /**
   * تبدیل تاریخ و ساعت به میلادی
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  toGeorgianDateTime(date?:string)
  {
    if(date)
    {
      moment.locale('en');

      let strDate = '';let strTime = '';
      if(date.indexOf('T') > 0){
        let d = date.split('T');
        strDate = d[0];
        strTime = d[0];
      }
      else{
        let d = date.split(' ');
        strDate = d[0];
        strTime = d[0];
      }
      strDate = moment.from(strDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');

      let t = strTime.split('.');
      strTime = t[0];

      return strDate+ " " + strTime;
    }
    return '';
  }


  /**
   * گرفتن سال به صورت شمسی
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  getJalaliYear(date?:string)
  {
    if(date)
    {
      moment.locale('fa');

      let strDate = '';
      if(date.indexOf('T') > 0){
        let d = date.split('T');
        strDate = d[0];
      }
      else{
        let d = date.split(' ');
        strDate = d[0];
      }

      return moment.from(strDate, 'en', 'YYYY-MM-DD').format('YYYY');
    }
    return '';
  }

  /**
   * گرفتن تاریخ و ساعت به صورت timestamp
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  getTimeStamp(date:string){
    var timeObject = new Date(date);
    return timeObject.getTime()/1000;
  }

  /**
   * تبدیل تاریخ و ساعت سرور به فرمت زیر
   * format: yyyy-MM-dd HH:mm
   * @param date تاریخ و ساعت لود شده از سمت سرور
   */
  serverDateTimeToCustomDateTime(date:string){
    let systemDate = formatDate(date, 'yyyy-MM-dd HH:mm','en-US');
    return systemDate;
  }

  /**
   * تبدیل تاریخ و ساعت به مدل مربوط به 
   * datepicker
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  stringDateTimeToDataPickerModel(date:string):any{
    let dateModel:DateModel= new DateModel();
    dateModel.year = Number(date.split('-')[0]);
    dateModel.month = Number(date.split('-')[1]);
    dateModel.day = Number(date.split('-')[2]);

    return dateModel;
  }


  /**
   * تبدیل تاریخ و ساعت به مدل مربوط به 
   * datepicker
   * @param date تاریخ و ساعت به صورت استرینگ
   */
  getDateModel(date:string,sep:string):any{
    let dateObj:DateModel = new DateModel();
    let splitDate = date.split(sep);
    dateObj.year = Number(splitDate[0]);
    dateObj.month = Number(splitDate[1]);
    dateObj.day = Number(splitDate[2]);

    return dateObj;
  }

  /**
   * اضافه کردن ماه به تاریخ مد نظر
   * @param datemodel تاریخ به صورت مدل
   * @param months تعداد ماهی که قرار است اضافه شود
   */
  AddMonthToDateModel(datemodel:DateModel,months:number):any{

    datemodel.month = datemodel.month + months;

    if(datemodel.month > 12){

      var extraMonths =  datemodel.month - 12;
      datemodel.month = 12;
      datemodel.year += Math.ceil(extraMonths/12);

    }

    return datemodel;
  }

  timeStampToDateTime(timeStamp:number):any{
    var date = new Date(timeStamp);
    return date.toLocaleString('en-US',{hour12: false});
  }

  modelToString(date:DateModel){
    return date.year+"-"+date.month+"-"+date.day;
  }
}
