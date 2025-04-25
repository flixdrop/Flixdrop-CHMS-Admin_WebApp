import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'animals',
    loadComponent: () =>
      import("../home/animals/animals.component").then((m) => m.AnimalsComponent)
  },
  {
    path: 'farms',
    loadComponent: () =>
      import("../home/farms/farms.component").then((m) => m.FarmsComponent)
  },
  {
    path: 'heats',
    loadComponent: () =>
      import("../home/heats/heats.component").then((m) => m.HeatsComponent)
  },
  {
    path: 'healths',
    loadComponent: () =>
      import("../home/healths/healths.component").then((m) => m.HealthsComponent)
  },
  {
    path: 'installations',
    loadComponent: () =>
      import("../home/installations/installations.component").then((m) => m.InstallationsComponent)
  },
  {
    path: 'fertilityratio',
    loadComponent: () =>
      import("../home/fertilityratio/fertilityratio.component").then((m) => m.FertilityRatioComponent)
  },
  {
    path: 'inseminations',
    loadComponent: () =>
      import("../home/inseminations/inseminations.component").then((m) => m.InseminationsComponent)
  },
  {
    path: 'activities',
    loadComponent: () =>
      import("../home/activities/activities.component").then((m) => m.ActivitiesComponent)
  },
  {
    path: 'charts/:animal',
    loadComponent: () =>
      import("../home/charts/charts.component").then((m) => m.ChartsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
