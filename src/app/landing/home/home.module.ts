import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule,
    SwiperModule
  ]
})
export class HomeModule { }
