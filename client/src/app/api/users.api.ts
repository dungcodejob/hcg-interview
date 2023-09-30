import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UserAPIResult } from "@shared/models/user-api-result";
import { CONFIG_TOKEN } from "../app.config";

@Injectable()
export class UsersApi {
  private readonly _config = inject(CONFIG_TOKEN);
  private readonly _http = inject(HttpClient);
  getProfile() {
    const headers = new HttpHeaders();
    headers.set("Accept", "application/vnd.github+json");
    return this._http.get<UserAPIResult>(this._config.githubUrl + `user`, {
      headers,
    });
  }
}
