import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../shared/services/general.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  CarouselItems = [
    {
      title:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ ",
      text:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده ",
      imageUrl:"./assets/images/carousel/4.jpg"
    },
    {
      title:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ ",
      text:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده ",
      imageUrl:"./assets/images/carousel/2.jpg"
    },
    {
      title:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ ",
      text:"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده ",
      imageUrl:"./assets/images/carousel/3.jpg"
    }
  
  ];

  LoginForm:FormGroup;

  vCodeSent:boolean = false;
  retryRequestCode:boolean = false;


  constructor(
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private router:Router,
    private gService:GeneralService
  ) {
    this.LoginForm = new FormGroup({
      mobile:new FormControl(null,[Validators.required , Validators.pattern("[\u06F0,0]{1}[\u06F9,9]{1}[\u06F0-\u06F9,0-9]{9}")]),
      code:new FormControl(null,[]),
      selectedCountry:new FormControl(1,[]),
    })
  }

  ngOnInit(): void {
    let self = this;
    this.userService.isAuth.subscribe(
      {
        next(res){
          if(res==true)
            self.router.navigate(['/dashboard']);
        }
      }
    );

    
  }

  changeMobile(){
    this.vCodeSent=false;
    this.LoginForm.reset();
    this.LoginForm.controls['code'].clearValidators();
    this.LoginForm.controls['code'].updateValueAndValidity();
    this.LoginForm.updateValueAndValidity();
  }

  RequestCode(){
    this.spinner.show();
    let self = this;
    this.retryRequestCode = false;

    this.userService.sendVCodeRequest(this.LoginForm.value.mobile)
      .subscribe({
        next(res){
          self.gService.showInfoToastr(res.data);
          self.vCodeSent = true;
          self.LoginForm.controls['code'].setValidators([Validators.required]);
          self.LoginForm.controls['code'].updateValueAndValidity();
          self.LoginForm.updateValueAndValidity();
        },
        error(){},
        complete(){
          self.spinner.hide();
          setTimeout(() => {
            self.retryRequestCode = true;
          }, 60000);
        }
      })
  }

  login(){
    
    if(this.vCodeSent){
      this.spinner.show();
      let self = this;

      this.userService.login(this.LoginForm.value)
      .subscribe({
        next(res:any){
          localStorage.setItem("user_token",res.data);
          self.userService.setIsAuth(true);
        },
        complete(){self.spinner.hide()}
      })
    }else{
      this.RequestCode();
    }
  }
}
