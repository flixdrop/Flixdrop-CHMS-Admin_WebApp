import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { AnimalManagementComponent } from './animal-management/animal-management.component';
import { HomeComponent } from './home/home.component';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserManagementComponent,
    AnimalManagementComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LandingRoutingModule,
    SwiperModule,
    TranslateModule
  ]
})
export class LandingModule { }
