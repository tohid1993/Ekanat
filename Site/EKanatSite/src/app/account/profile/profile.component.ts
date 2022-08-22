import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileViewModel, UserProfileVM } from 'src/app/shared/models/model';
import { FileService } from 'src/app/shared/services/file.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { LocationService } from 'src/app/shared/services/location.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  ProfileForm:FormGroup;

  CountriesList: any[] = [];
  ProvincesList: any[] = [];
  CitiesList: any[] = [];
  VillagesList: any[] = [];

  countriesCodesList:any[] = [];
  mobileCountryId!:number;

  constructor(
    public fileService:FileService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private locationService:LocationService,
    private gService:GeneralService
  ) {
    this.ProfileForm = new FormGroup(
      {
        firstName:new FormControl(null,[Validators.required]),
        lastName:new FormControl(null,[Validators.required]),
        email:new FormControl(null,[Validators.email]),
        userName:new FormControl(null,[]),
        image:new FormControl(new FileViewModel()),

        // nationalCode:new FormControl(null,[Validators.pattern("[\u06F0-\u06F9,0-9]{10}")]),
        // phone:new FormControl(null,[Validators.pattern("[\u06F0-\u06F9,0-9]{10}[\u06F0-\u06F9,0-9]*") , Validators.maxLength(15)]),
        countryId:new FormControl(null,[]),
        provinceId:new FormControl(null,[]),
        cityId:new FormControl(null,[]),
        villageId:new FormControl(null,[]),
        address:new FormControl(null,[])
      }
    )
  }

  ngOnInit(): void {
    this.getCountriesList();
    this.getCountryCodes();

    let self = this;
    this.userService.getUserProfile()
      .subscribe({
        next(res:any){
          self.ProfileForm.patchValue(res.data);
          let image = new FileViewModel();
          image.base64File = res.data.image;
          self.ProfileForm.controls['image'].setValue(image);
          self.setAddressDetails();

          self.mobileCountryId = res.data.mobileCountryId;
        }
      })
  }

  getCountriesList(){
    this.locationService.getCountriesList()
      .subscribe(
        res=>{
          if(res.isSuccess){
            this.CountriesList = res.data;
            this.setAddressDetails();
          }
        }
      )
  }

  saveProfile(){
    if(this.ProfileForm.invalid) return;
    
    let obj = this.gService.clone(this.ProfileForm.value)
    if(!obj.image.size_Byte)
      obj['image'] = null;

    this.spinner.show();
    let self = this;
    this.userService.updateUserProfile(obj)
    .subscribe({
      complete(){
          self.userService.loadUserDetails();
          self.spinner.hide();
      }
    })
  }

  LoadProvincesList(resetField:boolean = true){
    if(resetField)
      this.ProfileForm.controls['provinceId'].setValue(null);
    this.ProvincesList = this.CountriesList.find(c=>c.id == this.ProfileForm.value.countryId).provinces;
  }

  LoadCitiesList(resetField:boolean = true){
    if(resetField)
      this.ProfileForm.controls['cityId'].setValue(null);
    this.CitiesList = this.ProvincesList.find(c=>c.id == this.ProfileForm.value.provinceId).cities;
  }

  LoadVillagsList(resetField:boolean = true){
    if(resetField)
      this.ProfileForm.controls['villageId'].setValue(null);
    this.VillagesList = this.CitiesList.find(c=>c.id == this.ProfileForm.value.cityId).villages;
  }


  setAddressDetails(){
    if(this.ProfileForm.value.countryId) this.LoadProvincesList(false);
    if(this.ProfileForm.value.provinceId) this.LoadCitiesList(false);
    if(this.ProfileForm.value.cityId) this.LoadVillagsList(false);
  }

  getCountryCodes(){
    this.locationService.getCountriesCodes()
      .subscribe(
        (res:any)=>{
          if(res.isSuccess)
            this.countriesCodesList = res.data;
        }
      )
  }

  findCountryCode(){
    if(this.countriesCodesList && this.mobileCountryId){
      let country = this.countriesCodesList.find(c=>c.id == this.mobileCountryId);
      return country? country.code : '' ;
    }

    return '';
  }

}
