import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , AfterViewInit {

  @ViewChild('videoplayer',{static:true}) videoplayer!:ElementRef;

  constructor() { }
  ngAfterViewInit(): void {
    const media = this.videoplayer.nativeElement;
    media.muted = true; // without this line it's not working although I have "muted" in HTML
    media.play();
  }

  ngOnInit(): void {
  }

}
