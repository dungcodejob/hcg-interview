import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { CONFIG_TOKEN } from "../app.config";

export type TokenAPIResult = {
  access_token: string;
  scope: string;
  token_type: string;
};

@Injectable()
export class AuthApi {
  private readonly _config = inject(CONFIG_TOKEN);
  private readonly _http = inject(HttpClient);

  getGithubToken(code: string) {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    return this._http.post<TokenAPIResult>(
      this._config.apiUrl + `auth/token/${code}`,
      null,
      {
        headers,
      }
    );
  }

  getIdentityUrl(): Observable<{ url: string }> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    return this._http.get<{ url: string }>(this._config.apiUrl + `auth/identity-url`, {
      headers,
    });
  }
}
