import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../shared/services/general.service';
import { LocationService } from '../shared/services/location.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginForm:FormGroup;

  vCodeSent:boolean = false;
  retryRequestCode:boolean = false;

  CountriesCodes:any[] = [{code:'+98',id:1,icon:'ir',title:'Iran'}];



  constructor(
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private router:Router,
    private gService:GeneralService,
    private locationService:LocationService
  ) {
    this.LoginForm = new FormGroup({
      mobile:new FormControl(null,[Validators.required , Validators.pattern("[\u06F1-\u06F9,1-9]{1}[\u06F0-\u06F9,0-9]{9}[\u06F0-\u06F9,0-9]*")]),
      code:new FormControl(null,[]),
      countryCode:new FormControl("+98",[Validators.required]), // default Iran
    })
  }

  ngOnInit(): void {
    this.getCountriesCodesList();
    
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

    this.userService.sendVCodeRequest(this.LoginForm.value.mobile , this.LoginForm.value.countryCode)
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

  getCountriesCodesList(){
    this.locationService.getCountriesCodes()
      .subscribe((res:any)=>{
        this.CountriesCodes = [];
        this.CountriesCodes = res.data;
      })
  }
}
