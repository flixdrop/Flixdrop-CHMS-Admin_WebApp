import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmDetailsComponent } from './farm-details.component';

const routes: Routes = [
  {
    path: '',
    component: FarmDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmDetailsRoutingModule {}
