import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<
        any
    >(null);

    constructor(
        private readonly authService: AuthService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService,
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 0) {
                    this.notificationsService.show('Отсутствует подключение к интернету', {
                        label: 'Ошибка',
                        status: TuiNotification.Error,
                    }).subscribe();

                    return EMPTY;
                }

                if (error instanceof HttpErrorResponse && error.status !== 401 && error.error) {
                    this.notificationsService.show(error.error.message, {
                        label: 'Ошибка',
                        status: TuiNotification.Error,
                    }).subscribe();

                    return EMPTY;
                }

                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401 &&
                    !request.url.includes('refresh')
                ) {
                    const refreshToken = this.authService.getUserRefreshToken();

                    if (!refreshToken) {
                        return throwError(error);
                    }

                    return this.handle401Error(request, next);
                } else {
                    return throwError(error);
                }
            }),
        );
    }

    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap(_ => {
                    const accessToken = this.authService.getUserAuthToken();
                    const newReq: HttpRequest<any> = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(accessToken);

                    return next.handle(newReq);
                }),
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(_ => {
                    return next.handle(request);
                }),
            );
        }
    }
}
