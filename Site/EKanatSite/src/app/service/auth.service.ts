import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

    jwtHelper = new JwtHelperService();;

    public getToken(): string {
        const token: any = localStorage.getItem('customer_token');
        return token;

    }

    public isAuthenticated(): boolean {
        // get the token

        const token = this.getToken();

        if (token == null) {
            return false;
        }

        return !this.jwtHelper.isTokenExpired(token);
    }
}
