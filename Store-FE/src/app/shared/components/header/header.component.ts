import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CoreAuthService } from '../../../core/services/core-auth.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  protected readonly authService = inject(CoreAuthService);
  protected readonly storageService = inject(StorageService);
}
