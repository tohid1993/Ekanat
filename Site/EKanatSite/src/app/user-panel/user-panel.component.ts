import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  showMenu:boolean = false;
  windowWidth:number = window.innerWidth;

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }


  logOut(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }
}
