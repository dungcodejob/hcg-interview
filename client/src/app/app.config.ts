import {
  APP_INITIALIZER,
  ApplicationConfig,
  InjectionToken,
  Provider,
  inject,
} from "@angular/core";
import { Router, provideRouter } from "@angular/router";

import { Location } from "@angular/common";
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RepositoriesApi } from "./api/repositories.api";
import { UsersApi } from "./api/users.api";
import { routes } from "./app.routers";
import { AppStore } from "./app.store";
import { authInterceptor } from "./auth/auth-interceptor";
import { AuthApi } from "./auth/auth.api";
import { AuthStore } from "./auth/auth.store";
import { LocalStorageService } from "./shared/service/local-storage.service";

export interface EnvConfig {
  state: "development" | "production";
  apiUrl: string;
  githubUrl: string;
}
export const CONFIG_TOKEN = new InjectionToken<EnvConfig>("configs");

const authInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => {
    const router = inject(Router);
    const location = inject(Location);
    const authStore = inject(AuthStore);
    const localStorage = inject(LocalStorageService);
    const token = localStorage.get("token");
    if (token) {
      authStore.setToken(token);
      router.navigate(["home"]);
    } else if (!location.path().includes("github-callback")) {
      router.navigate(["login"]);
    }
  },
  // multi: true,
};

export const initAppConfig = (config: EnvConfig): ApplicationConfig => {
  return {
    providers: [
      {
        provide: CONFIG_TOKEN,
        useValue: config,
      },
      HttpClientModule,
      AuthApi,
      AuthStore,
      AppStore,
      UsersApi,
      RepositoriesApi,
      LocalStorageService,
      authInitializerProvider,
      provideAnimations(),
      provideRouter(routes),
      provideHttpClient(),
      provideHttpClient(withInterceptors([authInterceptor])),
    ],
  };
};
