import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { TelegramUser } from '../../core/models/user.model';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.less',
})
export class LoginComponent implements OnInit {

    private readonly authService: CoreAuthService = inject(CoreAuthService);
    private readonly router: Router = inject(Router);

    constructor() {
        (window as any).loginViaTelegram = this.loginViaTelegram.bind(this); // eslint-disable-line
    }

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/'])
                .then();
            return;
        }
    }

    login() {
        this.router.navigate(['/'])
            .then();
    }

    loginViaTelegram(user: TelegramUser) {
        this.authService.loginTg(user);
    }

}
