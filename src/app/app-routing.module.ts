import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '', redirectTo: 'landing', pathMatch: 'full'
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
    // canLoad: [AuthGuardService]
    canActivate: [AuthGuardService]
  },
  {
    path: 'default-page',
    loadChildren: () => import('./default-page/default-page.module').then(m => m.DefaultPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
