import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , AfterViewInit,OnDestroy {

  @ViewChild('videoplayer',{static:true}) videoplayer!:ElementRef;

  raychatInterval:any;

  constructor() { }

  ngAfterViewInit(): void {
    const media = this.videoplayer.nativeElement;
    media.muted = true; // without this line it's not working although I have "muted" in HTML
    media.play();
  }

  ngOnInit(): void {

    this.raychatInterval = setInterval(()=>{
      const raychat = document.getElementById('raychatBtn');
      if(raychat){
        raychat.style.bottom = '70px';
        raychat.style.right = '-15px';
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

}
