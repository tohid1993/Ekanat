import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { MemberFinancialDetailsViewModel, MemberPackageSummaryViewModel, MemberPackageThumbnailViewModel, PackageRemainingPromotionServiceViewModel, ServiceStatisticsViewModel, UserDetail } from '../common/models';
import { GeneralService } from './general.service';
import { Router } from '@angular/router';
import { LocationService } from './location.service';
import { StartupService } from './startup.service';


@Injectable({
    providedIn: 'root'
})

export class UserService extends BaseService {

    private _isAuth = new BehaviorSubject<boolean>(false);
    isAuth = this._isAuth.asObservable();

    private _profileObj = new BehaviorSubject<UserDetail>(new UserDetail());
    profileObj= this._profileObj.asObservable();

    private _userPackageSummaryDetail = new BehaviorSubject<MemberPackageSummaryViewModel>(
        undefined
    );
    userPackageSummaryDetail= this._userPackageSummaryDetail.asObservable();

    private _serviceStatistics = new BehaviorSubject<ServiceStatisticsViewModel>(
        undefined
    );
    serviceStatistics= this._serviceStatistics.asObservable();

    

    permissions:Subject<any> = new Subject();

    private loggedIn = false;

    constructor(
        private generalService:GeneralService,
        private locationService:LocationService,
        private router:Router,
        private startup:StartupService
        ) {

        super();

        this.loggedIn = !!localStorage.getItem('customer_token');
 
        this._isAuth.next(this.loggedIn);

    }


    login(loginform: any) {
        return this.generalService.postObservable<any>('Auth/LoginMember', loginform , {})
    }

    sendVCodeRequest(mobile:string, registered:boolean, cityId:number=0){
        return this.generalService.getObservable<any>
                (
                    "Member/ReceiveVCodeRequest",
                    {
                        mobile:mobile,
                        registered:registered,
                        cityId:cityId
                    }
                )
    }

    logout() {
        this.generalService.post(
            "Auth/Logoff",{},{}
        ).subscribe(
            res=>{
                this.clearLoginDatas();
            },error=>{
                this.clearLoginDatas();
            }
        )

        let pushToken = localStorage.getItem('push_token');
        if(pushToken){
            this.generalService.removeTokenToServer(pushToken)
        }
    }


    clearLoginDatas(){
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_role');
        localStorage.removeItem('customer_uid');
        localStorage.removeItem('customer_id');

        this.loggedIn = false;
        this._isAuth.next(false);
        this.router.navigate(['/login']);
        this.startup.resetPermissons();
    }



    loadUserDetails(){
        this.generalService.getObservable<UserDetail>( 'Home/getUserInfoAsync' , {})
        .subscribe(
            resp => {
                this._profileObj.next(resp);
            }
            , error =>{
            });
    }


    loadServiceStatistics(memberPackageId:number|undefined=undefined){
        // گرفتن لیست مجوز ها از سرویس
        let sections  = this.startup.getPermissons;
        // گرفتن مجوز از سرویس
        let permission = sections && sections['Service'] ? sections['Service']['getServiceStatisticsAsync'] : null;
        if(permission && permission==1){
            this.generalService.getObservable<ServiceStatisticsViewModel>(
                "Service/getServiceStatisticsAsync",
                {memberPackageId:memberPackageId}
            ).
            subscribe(
                res=>{
                    this._serviceStatistics.next(res);
                },error=>{
                    this.generalService.showErrorToastr(error.error.message);
                }
            )
        }
    }

    loadUserPackageSummaryDetail(){
        // گرفتن لیست مجوز ها از سرویس
        let sections  = this.startup.getPermissons;
        // گرفتن مجوز از سرویس
        let permission = sections && sections['MemberPackage'] ? sections['MemberPackage']['getMemberPackageSummaryAsync'] : null;
        
        if(permission && permission==1){

            this.generalService.getObservable<MemberPackageSummaryViewModel>(
                "MemberPackage/getMemberPackageSummaryAsync",
                {}
            ).
            subscribe(
                res=>{
                    this._userPackageSummaryDetail.next(res);
                    this.locationService.setDefaultCityId(res.memberCurrentCityId);
                },error=>{
                    this.generalService.showErrorToastr(error.error.message);
                }
            )
        }
    }

    setUserPackageSummaryDetail(obj:MemberPackageSummaryViewModel){
        this._userPackageSummaryDetail.next(obj);
    }

    GetRemainingPromotionServices(){
        return this.generalService.getObservable<PackageRemainingPromotionServiceViewModel>(
            "Service/GetRemainingPromotionServices",
            {}
        )
    }
    

    setIsAuth(x:boolean){
        this._isAuth.next(x);
    }

    getFinancialDetail(){
        return this.generalService.getObservable<MemberFinancialDetailsViewModel>
        (
          "Member/getFinancialDetailsAsync",{}
        )
    }


}

