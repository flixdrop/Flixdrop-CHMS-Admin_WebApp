import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HeatsComponent } from './heats/heats.component';
import { FertilityRatioComponent } from './fertilityratio/fertilityratio.component';
import { HealthsComponent } from './healths/healths.component';
import { InseminationsComponent } from './inseminations/inseminations.component';
import { InstallationsComponent } from './installations/installations.component';
import { AnimalsComponent } from './animals/animals.component';
import { FarmsComponent } from './farms/farms.component';
import { ChartsComponent } from './charts/charts.component';
import { ActivitiesComponent } from './activities/activities.component';

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
    component: AnimalsComponent,
  },
  {
    path: 'farms',
    component: FarmsComponent,
  },
  {
    path: 'heats',
    component: HeatsComponent,
  },
  {
    path: 'healths',
    component: HealthsComponent,
  },
  {
    path: 'installations',
    component: InstallationsComponent,
  },
  {
    path: 'fertilityratio',
    component: FertilityRatioComponent,
  },
  {
    path: 'inseminations',
    component: InseminationsComponent,
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
  },
  {
    path: 'charts/:animal',
    component: ChartsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
