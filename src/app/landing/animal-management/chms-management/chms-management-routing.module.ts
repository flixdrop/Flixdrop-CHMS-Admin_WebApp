import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChmsManagementComponent } from './chms-management.component';

const routes: Routes = [
  {
    path: '',
    component: ChmsManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChmsManagementRoutingModule {}
