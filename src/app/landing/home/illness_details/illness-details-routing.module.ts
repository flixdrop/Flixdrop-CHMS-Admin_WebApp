import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IllnessDetailsComponent } from './illness-details.component';

const routes: Routes = [
  {
    path: '',
    component: IllnessDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IllnessDetailsRoutingModule {}
