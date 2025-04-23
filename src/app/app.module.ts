import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthIntercepterService } from './services/intercepter/auth-intercepter.service';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NavigationComponent } from "./navigation/navigation.component";

// import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
// import { ApolloService } from './apollo.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthIntercepterService,
            multi: true
        },
        // {
        //     provide: APOLLO_OPTIONS,
        //     useFactory: (apolloService: ApolloService) => apolloService,
        //     deps: [ApolloService],
        //   }
    ],
    imports: [
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
        }),
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        HttpClientJsonpModule,
        NavigationComponent
    ]
})

export class AppModule { }
