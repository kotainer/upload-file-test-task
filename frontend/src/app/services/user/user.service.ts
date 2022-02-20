import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { IUser } from '../../interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../../interfaces/api-response.interface';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    isLogged$: ReplaySubject<boolean>;
    user$: BehaviorSubject<IUser>;

    constructor(private readonly http: HttpClient) {
        this.isLogged$ = new ReplaySubject<boolean>(1);
        this.user$ = new BehaviorSubject<IUser>(null);

        if (localStorage && localStorage.getItem('accessToken')) {
            this.getUserInfo();
        }
    }

    public getUserInfo() {
        return this.http
            .get(`${environment.apiUrl}/account/user/me`)
            .pipe(map((res: IApiResponse<IUser>) => res.data))
            .subscribe(
                (user: IUser) => {
                    this.user$.next(user);
                    this.isLogged$.next(true);
                },
                _ => this.isLogged$.next(false),
            );
    }

    public updateUser(user: IUser) {
        return this.http
            .put(`${environment.apiUrl}/account/user`, user)
            .pipe(tap(_ => this.getUserInfo()));
    }

    public findByLogin(login: string): Observable<IUser[]> {
        return this.http
            .get(`${environment.usersUrl}/users`, { params: { login } })
            .pipe(map((res: IApiResponse<IUser[]>) => res.data));
    }
}
