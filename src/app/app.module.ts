import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './landing/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SwiperModule } from 'swiper/angular';
import { customAnimation } from './services/animation/custom-animation';
import { AuthIntercepterService } from './services/intercepter/auth-intercepter.service';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    HeaderComponent,
    NavigationComponent
  ],
  imports:[
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot({
      navAnimation: customAnimation
    }),
    MatMenuModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    SwiperModule,
    HttpClientJsonpModule,
    ],
  bootstrap: [AppComponent],
  providers:[{provide: HTTP_INTERCEPTORS, useClass: AuthIntercepterService, multi: true}],
})

export class AppModule { }
