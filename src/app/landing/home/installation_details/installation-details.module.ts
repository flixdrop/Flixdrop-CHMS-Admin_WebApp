import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstallationDetailsComponent } from './installation-details.component';
import { InstallationDetailsRoutingModule } from './installation-details-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InstallationDetailsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    InstallationDetailsRoutingModule,
    TranslateModule
  ]
})
export class InstallationDetailsModule { }
