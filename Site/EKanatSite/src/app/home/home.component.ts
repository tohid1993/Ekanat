import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from "../shared/services/traslate.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , AfterViewInit,OnDestroy {
  @ViewChild('services',{static:true}) services!:ElementRef
  @ViewChild('about',{static:true}) about!:ElementRef
  @ViewChild('contactus',{static:true}) contactus!:ElementRef
  
  
  @ViewChild('videoplayer',{static:true}) videoplayer!:ElementRef;
  raychatInterval:any;

  isDotCom:boolean = false;
  isDotIr:boolean = false;

  kanatImageryPortalRightItems:string[] = []
  kanatImageryPortalLeftItems:string[] = []
  advantagesOfUsingThisSystem:string[] = []

  translateUnsub:any;

  constructor(
      private modalService: NgbModal,
      public translateService:TranslateService
  ) { }

  ngAfterViewInit(): void {
    const media = this.videoplayer.nativeElement;
    media.muted = true; // without this line it's not working although I have "muted" in HTML
    media.play();
  }

  ngOnInit(): void {
    if(window.location.host=="ekanat.ir") this.isDotIr = true;
    if(window.location.host=="ekanat.com") this.isDotCom = true;

    this.translateUnsub = this.translateService.data.subscribe({
      next:(data)=>{
        this.kanatImageryPortalRightItems = data['kanatImageryPortalRightItems'].split('%%')
        this.kanatImageryPortalLeftItems = data['kanatImageryPortalLeftItems'].split('%%')
        this.advantagesOfUsingThisSystem = data['advantagesOfUsingThisSystem'].split('%%')
      }
    })


    this.raychatInterval = setInterval(()=>{
      const raychat = document.getElementById('raychatBtn');
      if(raychat){

        if(window.innerWidth>=768){
          raychat.style.bottom = '30px';
          raychat.style.right = '0px';
        }else{
          raychat.style.bottom = '100px';
          raychat.style.right = '-30px';
        }

        this.destroyRaychatInterval();
      }
    },1000)

  }

  ngOnDestroy(): void {
    const raychat = document.getElementById('raychatBtn');
    if(raychat){
      raychat.style.bottom = '';
      raychat.style.right = '';
    }

    if(this.translateUnsub){
      this.translateUnsub.unsubscribe()
    }
  }

  destroyRaychatInterval(){
    clearInterval(this.raychatInterval)
  }

  openModal(key:string) {
    switch (key) {
      case 'services':
        this.modalService.open(this.services, { size: 'xl' });
        break;

      case 'about':
        this.modalService.open(this.about, { size: 'lg' });
        break;

      case 'contactus':
        this.modalService.open(this.contactus, { size: 'xl' });
        break;
  
      default:
        break;
    }
  }

  changeLang(lang:string){
    this.translateService.init(lang)

    window.location.reload()

  }
}
