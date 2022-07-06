import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable()
export class StartupService {

    baseUrl = '';
    private _permissions: any;
    private _sessionId: any;

    constructor(
      private http: HttpClient,
      private auth:AuthService,
      @Inject('BASE_URL') baseUrl: string
    ) {
        this.baseUrl = baseUrl;
    }

    // This is the method you want to call at bootstrap
    // Important: It should return a Promise
    load(): Promise<any> {
        this.loadSessionId();
        
        this._permissions = null;

        if(!this.auth.isAuthenticated())
          return Promise.resolve();

        return this.http
            .get(this.baseUrl + "RoleAction/getListByTokenAsync" , {})
            .pipe(
              map((res: any) => {
                this._permissions = res;
              })
            )
            .toPromise()
            .catch((err: any) => {
              Promise.resolve()
            });
    }


    get getPermissons(): any {
      return this._permissions;
    }

    resetPermissons(){
      this._permissions = undefined;
    }

    loadSessionId(){
      if(!localStorage.getItem('sessionId')){
        this._sessionId = null;

        this.http
            .get(this.baseUrl + "Home/getSessionId" , {responseType:"text"})
            .subscribe(
              res=>{
                localStorage.setItem('sessionId',res);
                this._sessionId = res
              }
            ) 
      }else{
        this._sessionId = localStorage.getItem('sessionId');
      }
    }

    get getSessionId(): any{
      return this._sessionId;
    }
}
