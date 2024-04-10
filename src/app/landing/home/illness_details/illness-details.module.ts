import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IllnessDetailsComponent } from './illness-details.component';
import { IllnessDetailsRoutingModule } from './illness-details-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [IllnessDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    IllnessDetailsRoutingModule,
    TranslateModule
  ]
})
export class IllnessDetailsModule { }
