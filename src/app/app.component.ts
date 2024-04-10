import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private platform: Platform, private router: Router, private authService: AuthService) {
    this.initializeApp();
  }

  ngOnInit() {

    this.authService.autoLogin();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEnd(event.url);
      }
    });
  }

  private handleNavigationEnd(url: string) {
    const isAuthenticated = this.authService.authenticatedUser.subscribe(user => {
      return !!user;
    });
    const isLoginPage = url.includes('/login');
    if(!isAuthenticated){
      this.router.navigateByUrl('/login');
    }
    else if (isAuthenticated && isLoginPage) {
      this.router.navigateByUrl('/landing');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {

      SplashScreen.hide().catch(error => {
        console.log('%c Splash Screen works only on native android and ios devices', 'color: crimson; font-size: 10px;');
      });
      StatusBar.setOverlaysWebView({ overlay: false }).catch(error => {
        console.log('%c Status Bar works only on native android and ios devices', 'color: crimson; font-size: 10px;');
      });
      StatusBar.setBackgroundColor({ color: "#ffffff" }).catch(error => {
        console.log('%c Status Bar works only on native android and ios devices', 'color: crimson; font-size: 10px;');
      });
    });
  }

}
