import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalManagementRoutingModule } from './animal-management-routing.module';
import { AddAnimalComponent } from './add-animal/add-animal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChmsManagementComponent } from './chms-management/chms-management.component';
import {  MatProgressSpinnerModule  } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AddAnimalComponent,
    ChmsManagementComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AnimalManagementRoutingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class AnimalManagementModule { }
