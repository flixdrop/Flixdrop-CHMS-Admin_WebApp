import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, map, take } from 'rxjs';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService{

  constructor(private router: Router, private authService: AuthService) { }

  logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    return status.connected;  
  };

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.authenticatedUser.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
    
  
    }
}

