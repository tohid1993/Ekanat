import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileViewModel } from 'src/app/shared/models/model';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  ProfileForm:FormGroup;

  constructor(
    public fileService:FileService
  ) {
    this.ProfileForm = new FormGroup(
      {
        firstName:new FormControl(null,[Validators.required]),
        lastName:new FormControl(null,[Validators.required]),
        email:new FormControl(null,[Validators.email]),
        mobile:new FormControl(null,[]),
        image:new FormControl(new FileViewModel()),
      }
    )
  }

  ngOnInit(): void {
  }

  saveProfile(){
    
  }

}
