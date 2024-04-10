import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimalDetailsComponent } from './animal-details.component';

const routes: Routes = [
  {
    path: '',
    component: AnimalDetailsComponent,
  },
  {
    path: ':animal',
    loadChildren: () => import('../visual_stat/visual-stat.module').then( m => m.VisualStatComponentModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalDetailsRoutingModule {}
