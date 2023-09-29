import { ApplicationConfig, InjectionToken } from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";

import { routes } from "./app.routers";

export interface EnvConfig {
  state: "development" | "production";
}
export const CONFIG_TOKEN = new InjectionToken<EnvConfig>("configs");

export const initAppConfig = (config: EnvConfig): ApplicationConfig => {
  return {
    providers: [
      {
        provide: CONFIG_TOKEN,
        useValue: config,
      },

      provideRouter(routes, withPreloading(PreloadAllModules)),

      // provideHttpClient(
      //   withInterceptors([apiPrefixInterceptor, authInterceptor, LoggingInterceptor])
      // ),
    ],
  };
};
