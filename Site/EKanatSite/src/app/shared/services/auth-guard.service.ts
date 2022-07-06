import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StartupService } from './startup.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private router: Router,
        private auth:AuthService,
        // private startup:StartupService
    ) {
    }

   
    canActivate(route: ActivatedRouteSnapshot){
        if(!this.auth.isAuthenticated()){            
            this.router.navigate(['/login']);
            return false;
        }

        return true;
        
        // let data = route.data;
        // // گرفتن لیست مجوزهای کاربر از سرویس
        // let sections  = this.startup.getPermissons;
        // //گرفتن مجوز مربوطه
        // let permission = sections[data.section] ? sections[data.section][data.action] : null;
        // if(!permission || permission==0){
        //     this.router.navigate(['/error',403]);
        // }else{
        //     return true;
        // }
       
    }
}
