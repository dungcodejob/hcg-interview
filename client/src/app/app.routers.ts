import { Routes } from "@angular/router";
import { GithubCallbackComponent } from "@pages/github-callback/github-callback.component";
import { authGuard } from "./auth/auth.guard";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () => import("@pages/home/home.component").then(d => d.HomeComponent),
    canActivate: [authGuard],

  },
  {
    path: "login",
    loadComponent: () =>
      import("@pages/login/login.component").then(d => d.LoginComponent),
  },
  // {
  //   path: "github-callback",
  //   loadComponent: () =>
  //     import("@pages/github-callback/github-callback.component").then(
  //       d => d.GithubCallbackComponent
  //     ),
  // },

  {
    path: "github-callback",
    component: GithubCallbackComponent,
  },
];
