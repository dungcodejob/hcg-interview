import { inject } from "@angular/core";
import { CanActivateChildFn, CanMatchFn } from "@angular/router";
import { map } from "rxjs";
import { AuthStore } from "./auth.store";
export const authGuard: CanMatchFn | CanActivateChildFn = () => {
  const token$ = inject(AuthStore).token$;

  return token$.pipe(map(token => (token ? true : false)));
};
