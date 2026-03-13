import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Good } from '../models/good.model';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TelegramUser, User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = environment.apiUrl;

    /*
    * goods
    */
    getGoods() {
        return lastValueFrom(this.http.get<Good[]>(`${this.apiUrl}/goods`));
    }

    /*
    * users
    */
    getUsers() {
        return lastValueFrom(this.http.get<User[]>(`${this.apiUrl}/users`));
    }

    getUserFromTelegramData(user: TelegramUser) {
        return lastValueFrom(this.http.post<User>(`${this.apiUrl}/user`, user));
    }

}
