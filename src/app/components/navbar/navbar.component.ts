import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, subscribeOn } from 'rxjs';
import { LoginResponce } from 'src/app/dto/loginResponce';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(private authService : AuthService,private router : Router) { }

  username : string = null;
  role : string = null;

  ngOnInit(): void {
    this.username=this.authService.getUsername();
    this.role=this.authService.getRole();
    this.authService.userEmitter.subscribe(()=>{
      this.username=this.authService.getUsername();
      this.role=this.authService.getRole()
    })
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['/home']);
  }
}
