import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InseminationDetailsComponent } from './insemination-details.component';
import { InseminationDetailsRoutingModule } from './insemination-details-routing.module';

@NgModule({
  declarations: [InseminationDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    InseminationDetailsRoutingModule
  ]
})
export class InseminationDetailsModule { }
