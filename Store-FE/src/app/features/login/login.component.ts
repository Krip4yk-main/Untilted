import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CoreAuthService } from '../../core/services/core-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent {
  private readonly authService = inject(CoreAuthService);
  private readonly router = inject(Router);

  login() {
    this.authService.login();
    this.router.navigate(['/']);
  }
}
