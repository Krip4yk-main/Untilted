import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CoreAuthService } from '../../../core/services/core-auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { Button } from 'primeng/button';
import { ITelegramUser } from '../../../core/models/user.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, Button, NgOptimizedImage],
    templateUrl: './header.component.html',
    styleUrl: './header.component.less',
})
export class HeaderComponent {

    protected readonly authService: CoreAuthService = inject(CoreAuthService);
    protected readonly storageService: StorageService = inject(StorageService);
    protected readonly router: Router = inject(Router);

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).loginViaTelegram = this.loginViaTelegram.bind(this);
    }

    loginViaTelegram(user: ITelegramUser) {
        this.authService.loginTg(user);
    }

    navigateToUser() {
        this.router.navigate(['/user']);
    }

}
