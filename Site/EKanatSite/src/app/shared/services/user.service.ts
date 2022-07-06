import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GeneralService } from './general.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class UserService  { 

    private _isAuth = new BehaviorSubject<boolean>(false);
    isAuth = this._isAuth.asObservable();

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

    sendVCodeRequest(mobile:string){
        return this.generalService.getObservable<any>
                (
                    "v1/Users/SendVerifyCode",
                    {
                        mobile:mobile,
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
        // this.generalService.getObservable<UserDetail>( 'Home/getUserInfoAsync' , {})
        // .subscribe(
        //     resp => {
        //         this._profileObj.next(resp);
        //     }
        //     , error =>{
        //     });
    }



    setIsAuth(x:boolean){
        this._isAuth.next(x);
    }


}

