import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Shared/services/user.service';
import { AuthService } from '../../../Shared/services/auth.service';
import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ILoginResponse } from '../../../Shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  
  fb = new FormBuilder();
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin() {
    if (this.form.valid) {
      this.userService.login({
        email: this.form.value.email || '',
        password: this.form.value.password || ''
      }).subscribe({
        next: (response: ILoginResponse) => {
            alert('Login successful');
            this.authService.token = response.accessToken;
            this.authService.name = response.name;
            this.router.navigateByUrl('/boards');
        },
        error: (error) => {
          console.error('Login failed:', error.message);
          if (error.status === 401) {
            alert('Invalid credentials. Please check your email and password.');
          } else if (error.status === 500) {
            alert('Server error. Please try again later.');
          } else {
            alert('Login failed: ' + error.message);
          }
        }
      });
    }
  }
}
