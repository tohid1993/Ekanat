import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    const media = this.videoplayer.nativeElement;
    media.muted = true; // without this line it's not working although I have "muted" in HTML
    media.play();
  }

  ngOnInit(): void {
    if(window.location.host=="ekanat.ir") this.isDotIr = true;
    if(window.location.host=="ekanat.com") this.isDotCom = true;
    
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
}
