import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AuthStore {
  private readonly _tokenSubject = new BehaviorSubject<string | null>(null);

  readonly token = this._tokenSubject.value;
  readonly token$ = this._tokenSubject.asObservable();

  setToken(value: string) {
    this._tokenSubject.next(value);
  }

  clear() {
    this._tokenSubject.next(null);
  }
}
