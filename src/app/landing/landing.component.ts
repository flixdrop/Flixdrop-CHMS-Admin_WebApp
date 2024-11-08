import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
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
      opacity: 1
    })),
    state('out', style({
      transform: 'translateY(-100%)',
      opacity: 0,
      display: 'none'
    })),
    transition('in => out', animate('100ms ease-in')),
    transition('out => in', animate('100ms ease-out'))
  ]),

  trigger('slideDown', [
    state('in', style({
      transform: 'translateY(100)',
      opacity: 1
    })),
    state('out', style({
      transform: 'translateY(-0%)',
      opacity: 0
    })),
    transition('in => out', animate('100ms ease-in')),
    transition('out => in', animate('100ms ease-out'))
  ])
]

})
export class LandingComponent implements OnInit {

  isVisible: boolean = true;

  constructor() { 
    this.initializeApp();
  }

  ngOnInit(){}

  initializeApp(){
    StatusBar.setBackgroundColor({ color: "#191902" }).catch(error => {
      console.log('%c Status Bar works only on native android and ios devices', 'color: crimson; font-size: 10px;');
    });
  }

  handleScrollStart() {
    this.isVisible = false;
  }

  handleScrollEnd() {
  
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.scrollTop > 0) {
      this.isVisible = false;
    } else if (ev.detail.scrollTop === 0) {
      this.isVisible = true;
    }
    else{
      this.isVisible = true;
      // clearTimeout(this.scrollTimeout);
      // this.scrollTimeout = setTimeout(() => {
      // }, 3000);
    }
  }

}
