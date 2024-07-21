import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Shared/services/user.service';
import { ILoginResponse, IRegister } from '../../../Shared/models/user.model';
import { AuthService } from '../../../Shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  fb = new FormBuilder();
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  onRegister() {
    if (this.form.valid) {
      const registerdInput: IRegister = {
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        firstName: this.form.value.firstName || '',
        lastName: this.form.value.lastName || '',
      };

      this.userService.register(registerdInput).subscribe({
        next: (response:ILoginResponse) => {
          alert(response.accessToken)
          this.authService.token = response.accessToken;
          this.authService.name = response.name;
          this.router.navigateByUrl('/boards');
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      })
    }
  }
}
