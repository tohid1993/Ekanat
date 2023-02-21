import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TranslateService } from '../shared/services/traslate.service';
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

  profileAvatar:string = "./assets/images/users/avatar-compare-page-kanat-vpm-artan1100-0106.png";
  isDotCom:boolean = false;
  isDotIr:boolean = false;

  constructor(
    private router:Router,
    public userService:UserService,
    private modalService: NgbModal,
    public translateService:TranslateService
  ) { }


  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  ngOnInit(): void {
    // this.initRaychat();
    
    if(window.location.host=="ekanat.ir") this.isDotIr = true;
    if(window.location.host=="ekanat.com") this.isDotCom = true;

    let self = this;
    this.userService.UserHomeInfo.subscribe
    ({
      next(res){
        if(res && !res.profileCompeleted){
          Swal.fire({
            icon:"warning",
            title: self.translateService.translate('unCompletedProfile'),
            text: self.translateService.translate('unCompletedProfileAlert'),
            confirmButtonText: self.translateService.translate('completeProfile')
          }).then((result) => {
            if (result.isConfirmed) {
              self.router.navigate(['/account/compare-page']);
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

  changeLang(lang:string){
    this.translateService.init(lang)

    window.location.reload()

  }
}
