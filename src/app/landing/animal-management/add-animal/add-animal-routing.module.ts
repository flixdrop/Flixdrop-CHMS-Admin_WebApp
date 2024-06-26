import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAnimalComponent } from './add-animal.component';

const routes: Routes = [
  {
    path: '',
    component: AddAnimalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAnimalRoutingModule {}
