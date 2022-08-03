import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GeneralService } from './general.service';
import { Router } from '@angular/router';
import { UserHomeInfoVM } from '../models/model';


@Injectable({
    providedIn: 'root'
})

export class UserService  {

    private _isAuth = new BehaviorSubject<boolean>(false);
    isAuth = this._isAuth.asObservable();

    private _UserHomeInfo = new BehaviorSubject<any>(undefined);
    UserHomeInfo = this._UserHomeInfo.asObservable();

    private loggedIn = false;

    constructor(
        private generalService:GeneralService,
        private router:Router,
        ) {

        this.loggedIn = !!localStorage.getItem('user_token');

        this._isAuth.next(this.loggedIn);
    }


    login(loginform: any) {
        return this.generalService.post('v1/Users/Login', loginform , {})
    }

    sendVCodeRequest(mobile:string,countryCode:string){
        return this.generalService.getObservable<any>
                (
                    "v1/Users/SendVerifyCode",
                    {
                        mobile:mobile,
                        countryCode: countryCode
                    }
                )
    }


    logout(){
        localStorage.clear();
        this.loggedIn = false;
        this._isAuth.next(false);
        this.router.navigate(['/login']);
    }



    loadUserDetails(){
        let self = this;
        this.generalService.get( 'v1/Users/GetHomeInfo' , {})
        .subscribe(
            {
                next(res:any){
                    self._UserHomeInfo.next(res.data);
                }
            }
        )
    }

    updateUserProfile(data:any){
        return this.generalService.update("v1/Users/EditProfile",data,{})
    }

    getUserProfile(){
        return this.generalService.get("v1/Users/GetProfile",{})
    }


    setIsAuth(x:boolean){
        this._isAuth.next(x);
    }


}

