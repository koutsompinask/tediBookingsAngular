import { Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  waitingApproval: boolean = false;
  registered : boolean = false;
  loggedInRole : string = null;

  constructor(private elementRef: ElementRef, private renderer: Renderer2,private route : ActivatedRoute,private authService : AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.waitingApproval = params['waiting'];
      this.registered = params['registered'];
    });
    this.loggedInRole = this.authService.getRole();
  }

  scrollToElement(frag: string) {
    const element = this.elementRef.nativeElement.querySelector(frag);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
