import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { HomeComponent } from './home/home.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LandingRoutingModule,
    TranslateModule,
    NavigationComponent
  ]
})
export class LandingModule { }
