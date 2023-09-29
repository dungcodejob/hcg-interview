import { isDevMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { initAppConfig } from "./app/app.config";

fetch(isDevMode() ? "assets/configs/development.json" : "assets/configs/production.json")
  .then(res => res.json())
  .then(configs => {
    bootstrapApplication(AppComponent, initAppConfig(configs)).catch(err =>
      console.error(err)
    );
  });
