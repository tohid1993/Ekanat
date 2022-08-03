import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  showMenu:boolean = false;
  windowWidth:number = window.innerWidth;

  newMessageCount:string|null = "";
  showSupportBtn:boolean = false;

  profileAvatar:string = "./assets/images/users/avatar.png";
  

  constructor(
    private router:Router,
    public userService:UserService
  ) { }

  ngOnInit(): void {
    this.initRaychat();
    
    let self = this;
    this.userService.UserHomeInfo.subscribe
    ({
      next(res){
        if(res && !res.profileCompeleted){
          Swal.fire({
            icon:"warning",
            title:"پروفایل تکمیل نشده",
            text:"برای ادامه فرایند و استفاده از قسمت های مختلف برنامه ، لطفا پروفایل خود را تکمیل نمایید",
            confirmButtonText:"تکمیل پروفایل"
          }).then((result) => {
            if (result.isConfirmed) {
              self.router.navigate(['/account/profile']);
            } 
          })
        }
      }
    })
  }


  logOut(){
    this.userService.logout();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  initRaychat(){
    let self = this;
    window.addEventListener('raychat_ready', function (ets) {
      self.showSupportBtn = true;

      var span = document.querySelectorAll('#raychat_main_button_count_s')[0];
      var mutateObserver = new MutationObserver(function(records) {
        self.newMessageCount = span.textContent;
      });
      mutateObserver.observe(span, {
        childList: true,                                 // capture child add/remove on target element.
        characterData: true,                     // capture text changes on target element
        subtree: true,                                   // capture childs changes too
        characterDataOldValue: true  // keep of prev value
      });
   });
  }

  openRayChat(){
    (window as any).Raychat.open();
  }
}
