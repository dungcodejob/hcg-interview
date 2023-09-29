import { Component, inject } from "@angular/core";
import { CONFIG_TOKEN } from "src/app/app.config";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
})
export class LoginComponent {
  config = inject(CONFIG_TOKEN);

  loginWithGithub() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}`
    );
  }
}
