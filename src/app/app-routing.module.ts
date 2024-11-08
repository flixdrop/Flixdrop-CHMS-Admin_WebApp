import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'farm',
    pathMatch: 'full',
  },
  {
    path: 'farm',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
    canActivate: [AuthGuardService], 
  },
  {
    path: 'default-page',
    loadChildren: () =>
      import('./default-page/default-page.module').then((m) => m.DefaultPageModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
