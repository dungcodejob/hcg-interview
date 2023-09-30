import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import { inject } from "@angular/core";

import { LocalStorageService } from "@shared/service/local-storage.service";
import { Observable, catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = inject(LocalStorageService).get("token");
  const exceptions = ["/login", "/auth", "assets"];

  const _addTokenToRequest = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    accessToken: string
  ): Observable<HttpEvent<unknown>> => {
    const headers = request.headers.set("Authorization", `Bearer ${accessToken}`);
    const clone = request.clone({ headers });

    return next(clone);
  };

  // not has token
  if (!token) {
    return next(req);
  }

  // is exception request
  if (exceptions.some(d => req.url.includes(d))) {
    return next(req);
  }

  // header no auth = true
  if (req.headers.get("No-Auth") === "True") {
    return next(req);
  }

  return _addTokenToRequest(req, next, token).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.Unauthorized
      ) {
        // logout
        // return authService.logout();
      }

      return throwError(() => error);
    })
  );
};
