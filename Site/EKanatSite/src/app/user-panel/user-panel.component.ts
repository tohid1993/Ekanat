import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  showMenu:boolean = false;
  windowWidth:number = window.innerWidth;

  constructor(
    private router:Router,
    private userService:UserService
  ) { }

  ngOnInit(): void {
  }


  logOut(){
    this.userService.logout();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }
}
