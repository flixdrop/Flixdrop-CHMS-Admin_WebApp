import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualStatComponent } from './visual_stat.component';

const routes: Routes = [
  {
    path: '',
    component: VisualStatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualStatComponentRoutingModule {}
