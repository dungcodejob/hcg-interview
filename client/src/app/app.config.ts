import { ApplicationConfig, InjectionToken } from "@angular/core";
import { provideRouter } from "@angular/router";

import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { AuthApi } from "./api/auth.api";
import { routes } from "./app.routers";

export interface EnvConfig {
  state: "development" | "production";
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
export const CONFIG_TOKEN = new InjectionToken<EnvConfig>("configs");

export const initAppConfig = (config: EnvConfig): ApplicationConfig => {
  return {
    providers: [
      {
        provide: CONFIG_TOKEN,
        useValue: config,
      },
      HttpClientModule,
      AuthApi,

      provideRouter(routes),
      provideHttpClient(),
      // provideHttpClient(
      //   withInterceptors([apiPrefixInterceptor, authInterceptor, LoggingInterceptor])
      // ),
    ],
  };
};
