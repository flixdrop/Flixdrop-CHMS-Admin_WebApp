import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
      },

      {
        path: "",
        redirectTo: "/farm/dashboard",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/farm/dashboard",
    pathMatch: "full",
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
