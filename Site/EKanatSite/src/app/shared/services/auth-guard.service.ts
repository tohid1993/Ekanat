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
    }
}
