import { IonicModule } from '@ionic/angular';
import { HeatPregnantDetailsRoutingModule } from './heat-pregnant-details-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeatPregnantDetailsComponent } from './heat-pregnant-details.component';

@NgModule({
  declarations: [HeatPregnantDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HeatPregnantDetailsRoutingModule
  ]
})
export class HeatPregnantDetailsModule { }
