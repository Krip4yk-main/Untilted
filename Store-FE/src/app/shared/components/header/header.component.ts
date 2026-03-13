import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CoreAuthService } from '../../../core/services/core-auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, Button],
    templateUrl: './header.component.html',
    styleUrl: './header.component.less',
})
export class HeaderComponent {

    protected readonly authService: CoreAuthService = inject(CoreAuthService);
    protected readonly storageService: StorageService = inject(StorageService);

}
