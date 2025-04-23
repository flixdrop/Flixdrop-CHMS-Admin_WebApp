import { Component } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [

    trigger('slideUp', [
      state('in', style({
        display: 'block',
        transform: 'translateY(0)',
        opacity: 1,
      })),
      state('out', style({
        transform: 'translateY(-100%)',
        opacity: 0,
        display: 'none',
      })),
      transition('in => out', animate('100ms ease-in')),
      transition('out => in', animate('100ms ease-out'))
    ]),

    trigger('slideDown', [
      state('in', style({
        transform: 'translateY(100)',
        opacity: 1,
      })),
      state('out', style({
        transform: 'translateY(-0%)',
        opacity: 0,
      })),
      transition('in => out', animate('100ms ease-in')),
      transition('out => in', animate('100ms ease-out'))
    ])
  ]
})

export class LandingComponent {

  isVisible: boolean = true;

  handleScrollStart() {
    this.isVisible = false;
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.scrollTop > 0) {
      this.isVisible = false;
    } else if (ev.detail.scrollTop === 0) {
      this.isVisible = true;
    }
    else {
      this.isVisible = true;
    }
  }

}
