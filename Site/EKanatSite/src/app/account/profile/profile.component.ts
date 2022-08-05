import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileViewModel, UserProfileVM } from 'src/app/shared/models/model';
import { FileService } from 'src/app/shared/services/file.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  ProfileForm:FormGroup;

  constructor(
    public fileService:FileService,
    private userService:UserService,
    private spinner:NgxSpinnerService
  ) {
    this.ProfileForm = new FormGroup(
      {
        firstName:new FormControl(null,[Validators.required]),
        lastName:new FormControl(null,[Validators.required]),
        email:new FormControl(null,[Validators.email]),
        userName:new FormControl(null,[]),
        image:new FormControl(new FileViewModel()),

        nationalCode:new FormControl(null,[Validators.pattern("[\u06F0-\u06F9,0-9]{10}")]),
        phone:new FormControl(null,[Validators.pattern("[\u06F0-\u06F9,0-9]{10}[\u06F0-\u06F9,0-9]*") , Validators.maxLength(15)]),
        countryId:new FormControl(null,[Validators.required]),
        provinceId:new FormControl(null,[Validators.required]),
        cityId:new FormControl(null,[Validators.required]),
        villageId:new FormControl(null,[]),
        address:new FormControl(null,[])
      }
    )
  }

  ngOnInit(): void {
    let self = this;
    this.userService.getUserProfile()
      .subscribe({
        next(res:any){
          self.ProfileForm.patchValue(res.data);
          let image = new FileViewModel();
          image.base64File = res.data.image;
          self.ProfileForm.controls['image'].setValue(image);
        }
      })
  }

  saveProfile(){
    if(this.ProfileForm.invalid) return;
    
    this.spinner.show();
    let self = this;
    this.userService.updateUserProfile(this.ProfileForm.value)
    .subscribe({
      complete(){
          self.userService.loadUserDetails();
          self.spinner.hide();
      }
    })
  }

}
