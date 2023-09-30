import { Component, inject } from "@angular/core";
import { AuthApi } from "src/app/auth/auth.api";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
})
export class LoginComponent {
  private readonly _authApi = inject(AuthApi);

  loginWithGithub() {
    this._authApi.getIdentityUrl().subscribe(res => window.location.assign(res.url));
  }
}
