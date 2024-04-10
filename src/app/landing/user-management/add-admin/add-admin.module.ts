import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAdminRoutingModule } from './add-admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,    
    AddAdminRoutingModule
  ]
})
export class AddAdminModule { }
