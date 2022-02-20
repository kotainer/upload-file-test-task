import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  public loginUser() {
    this.authService.login(this.loginForm.getRawValue())
      .subscribe(res => {
        this.router.navigate(['/', 'cabinet']);
      })
  }
}
