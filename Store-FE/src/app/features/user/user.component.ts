import { Component, inject } from '@angular/core';
import { CoreAuthService } from '../../core/services/core-auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.less',
})
export class UserComponent {
  protected readonly authService = inject(CoreAuthService);
}
