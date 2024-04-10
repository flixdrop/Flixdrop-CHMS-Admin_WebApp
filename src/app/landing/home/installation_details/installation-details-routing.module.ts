import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallationDetailsComponent } from './installation-details.component';

const routes: Routes = [
  {
    path: '',
    component: InstallationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallationDetailsRoutingModule {}
