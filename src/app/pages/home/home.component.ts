import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, map, switchMap, tap } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
})
export class HomeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authApi = inject(AuthApi);

  ngOnInit(): void {
    console.log(this.route.snapshot);

    this.route.queryParamMap
      .pipe(
        map(params => params.get("code")),
        tap(code => console.log(code)),
        filter(Boolean),
        switchMap(code => this.authApi.getGithubToken(code))
      )
      .subscribe(res => console.log(res));
  }
}
