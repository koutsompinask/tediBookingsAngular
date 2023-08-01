import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  scrollToElement(frag: string) {
    const element = this.elementRef.nativeElement.querySelector(frag);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
