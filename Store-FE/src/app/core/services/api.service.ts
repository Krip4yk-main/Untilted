import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IGood, IGoodTemplate } from '../models/good.model';
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
        return lastValueFrom(this.http.get<IGood[]>(`${this.apiUrl}/goods`));
    }

    getGoodById(id: number) {
        return lastValueFrom(this.http.get(`${this.apiUrl}/goods/${id}`));
    }

    getGoodByUniqueId(uniqueId: string) {
        return lastValueFrom(this.http.post<IGood>(`${this.apiUrl}/goods/id`, { uniqueId }));
    }

    getGoodByUniqueCode(uniqueCode: string) {
        return lastValueFrom(this.http.post<IGood>(`${this.apiUrl}/goods/code`, { uniqueCode }));
    }

    createGood(data: IGoodTemplate) {
        return lastValueFrom(this.http.post<IGood>(`${this.apiUrl}/goods/`, data));
    }

    createGoodBundle(data: IGoodTemplate[]) {
        return lastValueFrom(this.http.post<IGood[]>(`${this.apiUrl}/goods/bundle`, data));
    }

    updateGood(id: number, data: Partial<IGood>) {
        return lastValueFrom(this.http.put<[]>(`${this.apiUrl}/goods/${id}`, data));
    }

    updateGoodBundle(data: Partial<IGood>[]) {
        return lastValueFrom(this.http.put<[][]>(`${this.apiUrl}/goods/bundle`, data));
    }

    deleteGood(id: number) {
        return lastValueFrom(this.http.delete<[]>(`${this.apiUrl}/goods/${id}`));
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
