import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canLoad(_route: Route) {
    if (this.authService.getUserAuthToken()) {
      return true;
    }

    this.router.navigate(['/', 'auth', 'login']);

    return false;
  }
}
