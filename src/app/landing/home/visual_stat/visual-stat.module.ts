import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualStatComponentRoutingModule } from './visual-stat-routing.module';
import { VisualStatComponent } from './visual_stat.component';

@NgModule({
  declarations: [VisualStatComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualStatComponentRoutingModule
  ]
})
export class VisualStatComponentModule {}
