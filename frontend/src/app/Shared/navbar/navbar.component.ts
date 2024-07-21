import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  username: string = '';
  
  constructor(private router: Router) { }
  authService = inject(AuthService);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.authService.name$.subscribe(name => {
      this.username = name;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.token = undefined;
    this.authService.name = ''; 
    this.router.navigate(['/login']);
  }

  get initials(): string {
    return this.username.substring(0, 3).toUpperCase();
  }

  shouldShowNavbar(): boolean {
    return !(this.router.url.includes('/login') || this.router.url.includes('/register'));
  }
}
