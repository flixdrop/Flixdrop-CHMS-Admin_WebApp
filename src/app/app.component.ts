import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private platform: Platform, private router: Router, private authService: AuthService) {
  
  }

  ngOnInit() {

    // this.authService.autoLogin();

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.handleNavigationEnd(event.url);
    //   }
    // });

    const isUserSaved = JSON.parse(
      localStorage.getItem("isUserSaved")
    );

    if (isUserSaved) {
      console.log("Auto Signin In ...");
      this.authService.autoLogin();
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEnd(event.url);
      }
    });
  }

  private handleNavigationEnd(url: string) {
    const isAuthenticated = this.authService.authenticatedUser.subscribe(
      (user) => {
        return !!user;
      }
    );
    const isLoginPage = url.includes("/login");
    if (!isAuthenticated) {
      this.router.navigateByUrl("/login");
    } else if (isAuthenticated && isLoginPage) {
      this.router.navigateByUrl("/landing");
    }
  }

  // private handleNavigationEnd(url: string) {
  //   const isAuthenticated = this.authService.authenticatedUser.subscribe(user => {
  //     return !!user;
  //   });
  //   const isLoginPage = url.includes('/login');
  //   if(!isAuthenticated){
  //     this.router.navigateByUrl('/login');
  //   }
  //   else if (isAuthenticated && isLoginPage) {
  //     this.router.navigateByUrl('/farm');
  //   }
  // }

}
