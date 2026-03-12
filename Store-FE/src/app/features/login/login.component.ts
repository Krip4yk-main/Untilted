import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { from, lastValueFrom } from 'rxjs';
import { TelegramUser } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly authService = inject(CoreAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly httpClient = inject(HttpClient);
  private readonly renderer = inject(Renderer2);

  protected readonly tgBotToken = environment.tgBotToken;
  protected readonly tgBotClientId = environment.tgBotClientId;
  protected readonly tgBotClientSecret = environment.tgBotClientSecret;
  protected readonly tgBotCallbackUrl = environment.tgBotCallbackUrl;

  @ViewChild('script', { static: true }) script: ElementRef | undefined;

  constructor() {
    (window as any).loginViaTelegram = this.loginViaTelegram.bind(this);
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/'])
        .then();
      return;
    }
  }

  ngAfterViewInit() {
    this.convertToScript();
  }

  login() {
    this.router.navigate(['/'])
      .then();
  }

  convertToScript() {
    if (!this.script) return;
    const element = this.script.nativeElement;
    const script = this.renderer.createElement('script');

    script.src = 'https://telegram.org/js/telegram-widget.js?23';
    script.setAttribute('data-telegram-login', 'dndLvivStoreBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');

    this.renderer.appendChild(element, script);
  }

  loginViaTelegram(user: TelegramUser) {
    console.log('Logged in as', user.first_name);
    this.authService.loginTg(user);
  }
}
