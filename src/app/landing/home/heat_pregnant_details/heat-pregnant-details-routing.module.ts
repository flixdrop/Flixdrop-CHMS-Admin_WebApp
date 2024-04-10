import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeatPregnantDetailsComponent } from './heat-pregnant-details.component';

const routes: Routes = [
  {
    path: '',
    component: HeatPregnantDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatPregnantDetailsRoutingModule {}
