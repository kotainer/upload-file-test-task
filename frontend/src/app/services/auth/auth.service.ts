import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, Subject, tap } from 'rxjs';
import { IApiResponse, ILoginData, IRegisterData, ITokens } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  public readonly isTokenUpdated$ = new Subject<boolean>();;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  public getUserAuthToken() {
    return this.localStorageService.getItem(this.AUTH_TOKEN_KEY);
  }

  public getUserRefreshToken() {
    return this.localStorageService.getItem(this.REFRESH_TOKEN_KEY);
  }

  public login(loginData: ILoginData): Observable<ITokens | null> {
    return this.http
      .post<IApiResponse<ITokens>>(`${environment.apiUrl}/account/login`, loginData)
      .pipe(
        map(res => res.data),
        tap((data: ITokens) => {
          this.localStorageService.setItem(this.AUTH_TOKEN_KEY, data.accessToken);
          this.localStorageService.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
        })
      );
  }

  public register(loginData: IRegisterData): Observable<ITokens | null> {
    return this.http
      .post<IApiResponse<ITokens>>(`${environment.apiUrl}/account/register`, loginData)
      .pipe(
        map(res => res.data),
        tap((data: ITokens) => {
          this.localStorageService.setItem(this.AUTH_TOKEN_KEY, data.accessToken);
          this.localStorageService.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
        })
      );
  }

  public logout() {
    const refreshToken = this.localStorageService.getItem(this.REFRESH_TOKEN_KEY);

    return this.http
      .post(`${environment.apiUrl}/account/logout`, { refreshToken })
      .subscribe((_) => {
        this.clearTokens();
        this.router.navigateByUrl('/');
      });
  }

  public refreshToken(): Observable<ITokens> {
    const refreshToken = localStorage
      ? this.localStorageService.getItem(this.REFRESH_TOKEN_KEY)
      : '';

    this.clearTokens();

    return this.http
      .post<IApiResponse<ITokens>>(`${environment.apiUrl}/account/refresh`, { refreshToken })
      .pipe(
        map(res => res.data),
        tap((data: ITokens) => {
          this.localStorageService.setItem(this.AUTH_TOKEN_KEY, data.accessToken);
          this.localStorageService.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);

          this.isTokenUpdated$.next(true);
        })
      );
  }

  private clearTokens() {
    this.localStorageService.removeItem(this.AUTH_TOKEN_KEY);
    this.localStorageService.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
