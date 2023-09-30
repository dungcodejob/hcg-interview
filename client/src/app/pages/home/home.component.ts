import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { Router } from "@angular/router";

import { NgForTrackByPropertyModule } from "@shared/directive/ng-for-track-by-property.module";
import { RepeatDirective } from "@shared/directive/repeat.directive";
import { ScrollTrackerDirective } from "@shared/directive/scroll-tracker.directive";
import { Language } from "@shared/models/language";
import { Pagination } from "@shared/models/pagination";
import {
  RepositoriesFilter,
  RepositoriesQueryRequest,
} from "@shared/models/repositories-query-request";
import { Repository } from "@shared/models/repository";
import { UserAPIResult } from "@shared/models/user-api-result";
import { LocalStorageService } from "@shared/service/local-storage.service";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  finalize,
  of,
  skip,
  tap,
} from "rxjs";
import { RepositoriesApi } from "src/app/api/repositories.api";
import { UsersApi } from "src/app/api/users.api";
import { AppStore } from "src/app/app.store";
import { AuthStore } from "src/app/auth/auth.store";

type RepositoryVM = Repository & {
  watchers_count_display: string;
  updated_at_display: string;
};

type FilterBy = { [k in keyof RepositoriesFilter]: boolean };

const DEFAULT_PAGING: Pagination = {
  per_page: 20,
  page: 1,
};

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    NgForTrackByPropertyModule,
    ScrollTrackerDirective,
    AsyncPipe,
    NgxSkeletonLoaderModule,
    RepeatDirective,
    // Material Modules
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  providers: [],
})
export class HomeComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _repositoriesApi = inject(RepositoriesApi);
  private readonly _usersApi = inject(UsersApi);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _authStore = inject(AuthStore);
  private readonly _appStore = inject(AppStore);
  private readonly _paginationSubject = new BehaviorSubject<Pagination>(DEFAULT_PAGING);

  SIZE_MIN = 0;
  SIZE_MAX = 100 * 1000000;

  searchControl = this._fb.control("", { nonNullable: true });
  filterForm = this._fb.group({
    owner: this._fb.control(""),
    language: this._fb.control(""),
    updatedDate: this._fb.control<Date | null>(null),
    size: this._fb.group({
      min: this._fb.control(this.SIZE_MIN, { nonNullable: true }),
      max: this._fb.control(this.SIZE_MAX, { nonNullable: true }),
    }),
  });

  filterBy: FilterBy = {
    owner: true,
    language: false,
    size: false,
    updatedDate: false,
  };

  get sizeMin() {
    let value: number | string = this.filterForm.controls.size.controls.min.value;
    if (value > 1000000) {
      value = (value / 1000000).toFixed() + "Mb";
    } else {
      value = (value / 1000).toFixed() + "kb";
    }

    return value.toString();
  }

  get sizeMax() {
    let value: number | string = this.filterForm.controls.size.controls.max.value;

    if (value > 1000000) {
      value = (value / 1000000).toFixed() + "Mb";
    } else {
      value = (value / 1000).toFixed() + "kb";
    }
    return value.toString();
  }

  $searchHistory = this._appStore.$searchHistory;
  $items = signal<RepositoryVM[]>([]);
  $openAdvancedSearch = signal(false);
  $languages = signal<Language[]>([]);
  $error = signal("");
  $loading = signal(false);
  $user = signal<UserAPIResult | null>(null);
  total_count: number | null = null;
  @ViewChild(ScrollTrackerDirective, { static: true })
  scrollTracker!: ScrollTrackerDirective;

  @ViewChild(MatAutocompleteTrigger, { static: true })
  autocomplete!: MatAutocompleteTrigger;
  ngOnInit(): void {
    this._repositoriesApi.getLanguages().subscribe(res => this.$languages.set(res));
    this._usersApi.getProfile().subscribe(res => this.$user.set(res));
    const pagination$ = this._paginationSubject.asObservable();
    pagination$
      .pipe(
        skip(1),
        filter(pagination => {
          if (!this.total_count) {
            return true;
          }

          return this.total_count >= pagination.page * pagination.per_page;
        }),
        concatMap(pagination => {
          const keyword = this.searchControl.getRawValue();
          const filterRaw = this.filterForm.getRawValue();
          const filterValue: RepositoriesFilter = {
            owner: this.filterBy.owner ? filterRaw.owner : null,
            language: this.filterBy.language ? filterRaw.language : null,
            updatedDate: this.filterBy.updatedDate ? filterRaw.updatedDate : null,
            size: this.filterBy.size ? filterRaw.size : null,
          };
          return this.fetch({ keyword, ...pagination, ...filterValue });
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    //  const keyword$ = this.searchControl.valueChanges.pipe(
    //    debounceTime(1500),
    //    distinctUntilChanged(),
    //    startWith("")
    //  );

    //  const filter$ = this._filterSubject.asObservable();
    // combineLatest([keyword$, filter$])
    //   .pipe(
    //     tap(() => {
    //       this.$items.set([]);
    //       this._paginationSubject.next(DEFAULT_PAGING);
    //     }),
    //     switchMap(([keyword, filterValue]) =>
    //       pagination$.pipe(
    //         filter(() => !this.incomplete),
    //         concatMap(pagination =>
    //           this.fetch({ keyword, ...pagination, ...filterValue })
    //         )
    //       )
    //     ),

    //     takeUntilDestroyed(this._destroyRef)
    //   )

    //   .subscribe();
  }

  onSearch() {
    const keyword = this.searchControl.value;
    this.$error.set("");
    this.$items.set([]);
    this.total_count = null;
    this._paginationSubject.next(DEFAULT_PAGING);
    this.autocomplete.closePanel();
    if (keyword) {
      this._appStore.addSearchKeyword(keyword);
    }
  }

  onToggleAdvancedSearch() {
    this.$openAdvancedSearch.update(prev => !prev);
  }

  onRemoveUpdatedDate() {
    this.filterForm.controls.updatedDate.setValue(null);
  }

  onRemoveSize() {
    this.filterForm.patchValue({
      size: {
        min: this.SIZE_MIN,
        max: this.SIZE_MAX,
      },
    });
  }

  onScrollingFinished() {
    const value = this._paginationSubject.value;
    this._paginationSubject.next({ page: value.page + 1, per_page: value.per_page });
  }

  onLogout() {
    this._authStore.clear();
    this._localStorageService.clear();
    this._router.navigate(["/login"]);
  }
  private fetch(request: RepositoriesQueryRequest) {
    this.$loading.set(true);
    return this._repositoriesApi.getAll(request).pipe(
      tap(res => {
        this.total_count = res.total_count;

        this.$items.update(prev =>
          prev.concat(
            res.items.map(item => {
              let watchers_count: number | string = item.watchers_count;
              if (watchers_count > 1000000) {
                watchers_count = (watchers_count / 1000000).toFixed(1) + "M";
              } else if (watchers_count > 1000) {
                watchers_count = (watchers_count / 1000).toFixed(1) + "k";
              }

              return {
                ...item,
                watchers_count_display: watchers_count.toString(),
                updated_at_display: new Date(item.updated_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  }
                ),
              };
            })
          )
        );
      }),
      catchError((err: HttpErrorResponse) => {
        this.$error.set(err.error ? err.error.message : err.message);
        return of();
      }),
      finalize(() => this.$loading.set(false))
    );
  }
}
