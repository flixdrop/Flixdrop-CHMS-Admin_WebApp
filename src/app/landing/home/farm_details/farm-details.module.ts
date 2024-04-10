import { IonicModule } from '@ionic/angular';
import { FarmDetailsRoutingModule } from './farm-details-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FarmDetailsComponent } from './farm-details.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FarmDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FarmDetailsRoutingModule,
    TranslateModule
  ]
})
export class FarmDetailsModule { }
