import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
// import { UserManagementComponent } from './user-management/user-management.component';
// import { AnimalManagementComponent } from './animal-management/animal-management.component';
import { HomeComponent } from './home/home.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';

@NgModule({
  declarations: [
    // UserManagementComponent,
    // AnimalManagementComponent,
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
