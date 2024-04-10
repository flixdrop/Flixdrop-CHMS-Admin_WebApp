import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddAnimalComponent } from "./animal-management/add-animal/add-animal.component";
import { LandingComponent } from "./landing.component";
import { AddUserComponent } from "./user-management/add-user/add-user.component";
import { AddAdminComponent } from "./user-management/add-admin/add-admin.component";

const routes: Routes = [
  {
    path: "navs",
    component: LandingComponent,
    children: [
      {
        path: "home",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./home/home.module").then((m) => m.HomeModule),
          },
          {
            path: "",
            redirectTo: "/landing/navs/home",
            pathMatch: "full",
          },
        ],
      },

      {
        path: "user-management",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./user-management/user-management.module").then(
                (m) => m.UserManagementModule
              ),
          },
          {
            path: "add-user",
            component: AddUserComponent,
          },
          {
            path: "add-admin",
            component: AddAdminComponent,
          },
          {
            path: "",
            redirectTo: "/landing/navs/home",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "animal-management",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("./animal-management/animal-management.module").then(
                (m) => m.AnimalManagementModule
              ),
          },
          {
            path: "add-animal",
            component: AddAnimalComponent,
          },
          {
            path: "chms-management",
            loadChildren: () =>
              import(
                "./animal-management/chms-management/chms-management.module"
              ).then((m) => m.ChmsManagementModule),
          },
          {
            path: "",
            redirectTo: "/landing/navs/home",
            pathMatch: "full",
          },
        ],
      },
    ],
  },

  {
    path: "",
    redirectTo: "/landing/navs/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
