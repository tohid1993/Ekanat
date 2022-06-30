import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileViewModel } from '../common/models';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private gService:GeneralService
  ) { }


  /**
   * گرفتن اطلاعات فایل های آپلود شده
   * @param event دیتاهای آمده از سمت تگ های اینپوت
   * @param isOrginalName نام اصلی فایل استفاده شود؟ 
   */
  getFileDetails(event:any,isOrginalName:boolean):Observable<FileViewModel[]>{

    let returnValue = new BehaviorSubject<FileViewModel[]>([]);
    let selectedFiles:FileViewModel[] = [];

    let files:any[] = event.target.files;

    if (files) {
      let count=0;
      for (const file of files) {
        count++;
        let selectedFile:FileViewModel = new FileViewModel();

        if(isOrginalName){
          selectedFile.fileName = file.name.replace(/\.[^/.]+$/, '');
        }else{
          selectedFile.fileName = '';
        }



        let fileRestriction:FileRestrictionsModel=undefined;
        if(event.target.dataset.filelimit){
          fileRestriction = this.getFileRestrictions(event.target.dataset.filelimit);
        }

        // مدیریت سایز فایل
        selectedFile.size = file.size;
        if(fileRestriction){
          let msg='';
          let title='خطای حجم فایل !';
          
          if(fileRestriction.maxSize && fileRestriction.maxSize*1024 < file.size)
          {
            msg = 'حجم فایل انتخابی باید کمتر از '+fileRestriction.maxSize+'kb باشد.';
          }

          if(fileRestriction.minSize && fileRestriction.minSize*1024 > file.size)
          {
            msg = 'حجم فایل انتخابی باید بیشتر از '+fileRestriction.minSize+'kb باشد.';
          }

          if(msg!=''){
            this.gService.showErrorToastr(msg,title);
            break;
          }
        }

        // مدیریت نوع فایل
        let split=file.name.split('.');
        selectedFile.fileTypeName = '.'+split[split.length-1];
        if(fileRestriction && !fileRestriction.type.includes(selectedFile.fileTypeName)){
          this.gService.showErrorToastr(
            'فرمت فایل باید '+fileRestriction.type+' باشد. ',
            'فایل نا معتبر!'  
          );
          // return returnValue;
          break;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            // برای حذف عبارت ابتدای base 64
            let base64 = e.target.result;

            // بررسی ابعاد
            if(fileRestriction &&
              (fileRestriction.minHeight || fileRestriction.maxHeight 
                ||
                fileRestriction.maxWidth || fileRestriction.minWidth 
                ||
                (fileRestriction.ratio && fileRestriction.ratio.length>0)
              )){

                let msg='';
                let title='خطا در ابعاد!';

                var image = new Image();
                image.src = base64;
                let gs = this.gService;
                image.onload = function () {
                  
                  if(fileRestriction.maxHeight && fileRestriction.maxHeight < image.height)
                  {
                    msg = 'ارتفاع فایل انتخابی باید کمتر از '+fileRestriction.maxHeight+'px باشد.';
                  }
        
                  if(fileRestriction.minHeight && fileRestriction.minHeight > image.height)
                  {
                    msg = 'ارتفاع فایل انتخابی باید بیشتر از '+fileRestriction.minHeight+'px باشد.';
                  }

                  if(fileRestriction.maxWidth && fileRestriction.maxWidth < image.width)
                  {
                    msg = 'عرض فایل انتخابی باید کمتر از '+fileRestriction.maxWidth+'px باشد.';
                  }
        
                  if(fileRestriction.minWidth && fileRestriction.minWidth > image.width)
                  {
                    msg = 'عرض فایل انتخابی باید بیشتر از '+fileRestriction.minWidth+'px باشد.';
                  }

                  if(
                    (fileRestriction.minWidth && fileRestriction.maxWidth && fileRestriction.minWidth == fileRestriction.maxWidth) &&
                    (fileRestriction.minHeight && fileRestriction.maxHeight && fileRestriction.minHeight == fileRestriction.maxHeight)
                  )
                  {
                    if(fileRestriction.minWidth != image.width || fileRestriction.minHeight != image.height)
                      msg = 'ابعاد فایل انتخابی باید '+ fileRestriction.minWidth + ' در ' + fileRestriction.minHeight + ' px باشد. ';
                  }

                  if(fileRestriction.ratio)
                  {
                    let ratio = fileRestriction.ratio.split(':');
                    if((Number)(ratio[1]) * image.width / image.height != (Number)(ratio[0])){
                      msg = 'نسبت ابعاد فایل انتخابی باید  '+ratio[0] + ' به ' +ratio[1]+' باشد. ';
                    }
                  }

                  if(msg!=''){
                    gs.showErrorToastr(msg,title);
                  }else{
                    if(base64!=null){
                      let base64string = base64.replace(/data.*;base64,/g,'');
                      selectedFile.base64File = base64string;
                      selectedFiles.push(selectedFile);
                      gs.showSuccessToastr('فایل با موفقیت انتخاب شد.')
                      returnValue.next(selectedFiles);
                    }
                  }
                }
            }else{
              if(base64!=null){
                let base64string = base64.replace(/data.*;base64,/g,'');
                selectedFile.base64File = base64string;
                selectedFiles.push(selectedFile);
                this.gService.showSuccessToastr('فایل با موفقیت انتخاب شد.')
                returnValue.next(selectedFiles);
              }
            }
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
    return returnValue;
  }


  /**
   * فایل های انتخابی اول به این تابع ارسال میشوند
   * @param event دیتاهای ارسالی از سمت تگ اینپوت
   * @param control فیلدی که فایل قرار است در آن قرار بگیرد
   * @param isOrginalName نام اصلی فایل ثبت شود؟
   * @param isFormControl این فیلد آیا فیلد کنترلر هست؟
   * @param allowNull اجازه بده که نال برگردونه به جای فایل خالی
   */
  fileOnSelect(event:any,control:any,isOrginalName:boolean=false,isFormControl:boolean=true,allowNull:boolean=false){
    let files; 
    this.getFileDetails(event,isOrginalName).subscribe(
      res=>{
        if(res && res.length>0){
          files=res;
          if(isFormControl)
            control.setValue(files[0]);
          else
            control = files[0];
        }else{
          event.target.value = "";
          if(isFormControl)
            control.setValue(allowNull ? null : new FileViewModel());
          else
            control = allowNull ? null : new FileViewModel();
        }
      },error=>{
        event.target.value = "";
        if(isFormControl)
          control.setValue(allowNull ? null : new FileViewModel());
        else
          control = allowNull ? null : new FileViewModel();
      }
    );
  }




  /**
   * حذف فایل از فیلد مورد نظر
   * @param control فیلدی که فایل در آن قرار دارد
   * @param isFormControl آیا یک فرم کنترلر هست؟
   * @param isNull نال باشد یا یک مدل خالی
   */
  removeImage(control:any,isFormControl:boolean=true,isNull:boolean=false){
    if(isFormControl)
      control.setValue(isNull ? null : new FileViewModel());
    else
      control = isNull ? null : new FileViewModel();
  }



  /**
   * گرفتن ویژگی های نوع فایل مورد نظر
   * @param ms نوع فایل مورد نیاز 
   */
  getFileRestrictions(ms:string){
    let fr:FileRestrictionsModel;

    switch (ms) {
      case 'logo_options': //Logo
        fr = {
          maxSize:1024,
          minSize:1,
          maxHeight:800,
          minHeight:undefined,
          maxWidth:800,
          minWidth:undefined,
          ratio:"1:1",
          type:['.jpg','.png','.jpeg']
        }
        break;
      case 'icon_options': //Logo
        fr = {
          maxSize:1024,
          minSize:1,
          maxHeight:256,
          minHeight:undefined,
          maxWidth:256,
          minWidth:undefined,
          ratio:"1:1",
          type:['.jpg','.png','.jpeg']
        }
        break;

      case 'package_icon_options': //package icon
        fr = {
          maxSize:1024,
          minSize:1,
          maxHeight:512,
          minHeight:undefined,
          maxWidth:512,
          minWidth:undefined,
          ratio:"1:1",
          type:['.png']
        }
        break;

      case 'ad_video_options': //ad_video
        fr = {
          maxSize:2*1024,
          minSize:undefined,
          maxHeight:undefined,
          minHeight:undefined,
          maxWidth:undefined,
          minWidth:undefined,
          ratio:undefined,
          type:['.webm']
        }
        break;

      case 'ad_image_options': //ad_image
        fr = {
          maxSize:1*1024,
          minSize:undefined,
          maxHeight:undefined,
          minHeight:undefined,
          maxWidth:undefined,
          minWidth:undefined,
          ratio:undefined,
          type:['.jpg','.png']
        }
        break;

      case 'excel_options': //excel import file option
        fr = {
          maxSize:undefined,
          minSize:undefined,
          maxHeight:undefined,
          minHeight:undefined,
          maxWidth:undefined,
          minWidth:undefined,
          ratio:undefined,
          type:['.xlsx']
        }
        break;

      case 'word_options': //excel import file option
        fr = {
          maxSize:undefined,
          minSize:undefined,
          maxHeight:undefined,
          minHeight:undefined,
          maxWidth:undefined,
          minWidth:undefined,
          ratio:undefined,
          type:['.docx']
        }
        break;

    
      default:
        fr = new FileRestrictionsModel(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          []
        );
    }

    return fr;
  }

  /**
   * قراردادن عکس قبلی در فیلد مورد نظر
   * @param img لینک عکس قبلی 
   */
  setOldImageToForm(img:string){
    // if(img.indexOf('no-image')==-1){
      let oldImage:FileViewModel = new FileViewModel();
      oldImage.base64File = img;
      oldImage.fileName = img;
      return oldImage;
    // }

    // return new FileViewModel();
  }

  
  /**
   * قراردادن فیلم قبلی در فیلد مورد نظر
   * @param vdo لینک فیلم قبلی 
   */
  setOldVideoToForm(vdo:string){
    if(vdo.indexOf('no-video')==-1){
      let oldVideo:FileViewModel = new FileViewModel();
      oldVideo.base64File = vdo;
      oldVideo.fileName = vdo;
      return oldVideo;
    }

    return new FileViewModel();
  }





  /**
   * گرفتن یک اسکرین شات از فایل ویدیویی
   * @param video تگ فایل ویدویی
   */
  captureFromVideo(video:HTMLVideoElement) {
    let canvas = <HTMLCanvasElement>document.createElement('canvas');     
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    let base64 = canvas.toDataURL("image/jpeg");

    let thumbnail = new FileViewModel();
    thumbnail.size = this.calculateSizeFromBase64(base64);

    if(base64!=null){
      base64 = base64.replace(/data.*;base64,/g,'');
    }

    thumbnail.base64File = base64;
 
    return thumbnail;
  }

  /**
   * محاسبه حجم فایل از روی base64
   * @param base64String 
   */
  calculateSizeFromBase64(base64String){
    let padding, inBytes, base64StringLength;
    if(base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    inBytes =(base64StringLength / 4 ) * 3 - padding;
    return inBytes;
  }
}


export class FileRestrictionsModel{
  maxSize:number;
  minSize:number;

  maxHeight:number;
  minHeight:number;
  
  maxWidth:number;
  minWidth:number;

  ratio:string;
  type:string[];

  constructor(
    maxSize,
    minSize,
    maxHeight,
    minHeight,
    maxWidth,
    minWidth,
    ratio,
    type){
    this.maxSize =maxSize || undefined;
    this.minSize =minSize || undefined;

    this.maxHeight =maxHeight || undefined;
    this.minHeight =minHeight || undefined;

    this.maxWidth =maxWidth || undefined;
    this.minWidth =minWidth || undefined;

    this.ratio = ratio || undefined;

    this.type = type || [];
  }
}