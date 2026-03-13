import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Good } from '../models/good.model';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITelegramUser, IUser } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = environment.apiUrl;

    getToken(user: ITelegramUser): Promise<string> {
        return lastValueFrom(this.http.post<string>(`${this.apiUrl}/token`, user));
    }

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
        return lastValueFrom(this.http.get<IUser[]>(`${this.apiUrl}/users`));
    }

    getUserFromTelegramData(user: ITelegramUser) {
        return lastValueFrom(this.http.post<IUser>(`${this.apiUrl}/users/tg`, user));
    }

}
