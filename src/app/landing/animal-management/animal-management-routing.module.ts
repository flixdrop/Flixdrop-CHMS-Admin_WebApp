import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimalManagementComponent } from './animal-management.component';

const routes: Routes = [
  {
    path: '',
    component: AnimalManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalManagementRoutingModule {}
