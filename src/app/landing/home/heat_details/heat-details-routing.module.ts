import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeatDetailsComponent } from './heat-details.component';

const routes: Routes = [
  {
    path: '',
    component: HeatDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatDetailsRoutingModule {}
