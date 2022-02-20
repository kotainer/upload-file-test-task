import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public registerForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  public registerUser() {
    this.authService.register(({
      login: this.registerForm.get('login')?.value,
      password: this.registerForm.get('password')?.value,
    })).subscribe(() => {
      this.router.navigate(['/', 'cabinet']);
    })
  }
}
