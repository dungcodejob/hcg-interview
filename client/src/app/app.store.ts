import { Injectable, computed, signal } from "@angular/core";
import { UserAPIResult } from "@shared/models/user-api-result";

type UserProfile = UserAPIResult;

@Injectable()
export class AppStore {
  private readonly _$searchHistory = signal<string[]>([]);
  private readonly _$userProfile = signal<UserProfile | null>(null);
  readonly $searchHistory = this._$searchHistory.asReadonly();

  readonly $userProfile = computed(() => {
    const user = this._$userProfile();
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });

  setUser(value: UserProfile) {
    this._$userProfile.set(value);
  }

  addSearchKeyword(keyword: string) {
    if (!this.$searchHistory().includes(keyword)) {
      this._$searchHistory.update(prev => [keyword, ...prev]);
    }
  }
}
