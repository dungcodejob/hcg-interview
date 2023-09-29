import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () => import("@pages/home/home.component").then(d => d.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("@pages/login/login.component").then(d => d.LoginComponent),
  },
];
