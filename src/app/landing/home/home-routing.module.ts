import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
   {
    path: 'animal-details',
    loadChildren: () => import('./animal_details/animal-details.module').then( m => m.AnimalDetailsModule),
  },
  {
    path: 'farm-details',
    loadChildren: () => import('./farm_details/farm-details.module').then( m => m.FarmDetailsModule)
  },
  {
    path: 'heat-details',
    loadChildren: () => import('./heat_details/heat-details.module').then(m => m.HeatDetailsModule)
  },
  {
    path: 'illness-details',
    loadChildren: () => import('./illness_details/illness-details.module').then(m => m.IllnessDetailsModule)
  },
  {
    path: 'installation-details',
    loadChildren: () => import('./installation_details/installation-details.module').then(m => m.InstallationDetailsModule)
  },
  {
    path: 'heat-pregnant-details',
    loadChildren: () => import('./heat_pregnant_details/heat-pregnant-details.module').then(m => m.HeatPregnantDetailsModule)
  },
  {
    path: 'insemination-details',
    loadChildren: () => import('./insemination_details/insemination-details.module').then(m => m.InseminationDetailsModule)
  },

  {
    path: '',
    redirectTo: '/landing/navs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
