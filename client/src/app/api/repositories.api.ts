import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Language } from "@shared/models/language";
import { RepositoriesQueryRequest } from "@shared/models/repositories-query-request";
import { RepositoryAPIResult } from "@shared/models/repository-api-result";
import { Observable } from "rxjs/internal/Observable";
import { CONFIG_TOKEN } from "../app.config";

@Injectable()
export class RepositoriesApi {
  private readonly _config = inject(CONFIG_TOKEN);
  private readonly _http = inject(HttpClient);
  getAll(request: RepositoriesQueryRequest) {
    const headers = new HttpHeaders();
    headers.set("Accept", "application/vnd.github+json");

    let query = "";
    if (request.keyword) {
      query = query + `${request.keyword} in:name`;
    }

    if (request.owner) {
      query = query + `+owner:${request.owner}`;
    }

    if (request.language) {
      query = query + `+language:${request.language}`;
    }

    if (request.size) {
      query = query + `+size:${request.size.min}..${request.size.max}`;
    }

    if (request.updatedDate) {
      const [withoutTime] = request.updatedDate.toISOString().split("T");
      query = query + `+pushed:${withoutTime}`;
    }

    query = query + `&per_page=${request.per_page}`;
    query = query + `&page=${request.page}`;

    console.log(query);

    return this._http.get<RepositoryAPIResult>(
      this._config.githubUrl + `search/repositories?q=${query}`,
      {
        headers,
      }
    );
  }

  getLanguages(): Observable<Language[]> {
    return this._http.get<Language[]>("assets/languages.json");
  }
}
