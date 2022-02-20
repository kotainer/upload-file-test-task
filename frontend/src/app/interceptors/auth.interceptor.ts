import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private readonly authService: AuthService) {

    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (req.headers.get('External')) {
            const newHeaders = req.headers.delete('External');
            const newRequest = req.clone({ headers: newHeaders });

            return next.handle(newRequest);
        } else {
            const accessToken = this.authService.getUserAuthToken() || '';
            const authReq = req.clone({
                setHeaders: { Authorization: accessToken },
            });

            return next.handle(authReq);
        }
    }
}
