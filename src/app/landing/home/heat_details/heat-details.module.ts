import { IonicModule } from '@ionic/angular';
import { HeatDetailsRoutingModule } from './heat-details-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeatDetailsComponent } from './heat-details.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HeatDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HeatDetailsRoutingModule,
    TranslateModule
  ]
})
export class HeatDetailsModule { }
