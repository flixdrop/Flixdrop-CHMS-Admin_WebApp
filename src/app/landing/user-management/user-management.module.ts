import { AddAdminComponent } from './add-admin/add-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    AddUserComponent,
    AddAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,     
    UserManagementRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserManagementModule { }
