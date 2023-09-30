import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "@shared/service/local-storage.service";
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap
} from "rxjs";
import { UsersApi } from "src/app/api/users.api";
import { AppStore } from "src/app/app.store";
import { AuthApi } from "src/app/auth/auth.api";
import { AuthStore } from "src/app/auth/auth.store";

@Component({
  templateUrl: "./github-callback.component.html",
  styleUrls: ["./github-callback.component.scss"],
  standalone: true,
})
export class GithubCallbackComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _authApi = inject(AuthApi);
  private readonly _authStore = inject(AuthStore);
  private readonly _localStorage = inject(LocalStorageService);
  private readonly _usersApi = inject(UsersApi);
  private readonly _appStore = inject(AppStore);

  ngOnInit(): void {
    this._route.queryParamMap
      .pipe(
        map(params => params.get("code")),
        filter(Boolean),
        switchMap(code =>
          this._authApi.getGithubToken(code).pipe(
            tap(res => {
              this._authStore.setToken(res.access_token);
              this._localStorage.set("token", res.access_token);
            }),
            // concatMap(() => this.getUserProfile())
          )
        ),

        catchError(err => {
          console.log(err);
          this._router.navigate(["login"]);
          return of();
        })
      )
      .subscribe(() => {
        this._router.navigate(["home"]);
      });
  }

  getUserProfile() {
    return this._usersApi.getProfile().pipe(tap(res => this._appStore.setUser(res)));
  }
}
