import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserRoutingModule } from './add-user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,    
    AddUserRoutingModule
  ]
})
export class AddUserModule { }
