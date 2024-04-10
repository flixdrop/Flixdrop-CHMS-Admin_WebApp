import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthIntercepterService implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.authenticatedUser.pipe(
      take(1),
      exhaustMap(user => {
        const language = localStorage.getItem("language") || "en";

        const currentRoute = req.url;
        const isGraphPage = currentRoute.includes('https://chms-firebase-default-rtdb.firebaseio.com/');
        const modifiedReq = req.clone({
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set("Accept-Language", language)
        });

        if (user && !isGraphPage) {
          const modifiedReq = req.clone({
            headers: new HttpHeaders()
              .set('Authorization', `Bearer ${user['token']}`)
              .set("Accept-Language", language)
              .set('Content-Type', 'application/json'),
          });
          return next.handle(modifiedReq);
        }
        else if(user && isGraphPage){        
          return next.handle(req);
        }
        
        return next.handle(modifiedReq);
      }),
    );
  }

}
