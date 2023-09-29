import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { CONFIG_TOKEN } from "../app.config";

@Injectable()
export class AuthApi {
  config = inject(CONFIG_TOKEN);
  http = inject(HttpClient);

  getGithubToken(code: string) {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const params = new HttpParams()
      .set("client_id", this.config.clientId)
      .set("client_secret", this.config.clientSecret)
      .set("code", code);

    return this.http.get("https://github.com/login/oauth/access_token", {
      headers,
      params,
    });
  }
}
