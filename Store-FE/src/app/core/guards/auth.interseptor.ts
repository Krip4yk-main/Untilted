import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageBuckets, LocalStorageService } from '../services/local-storage.service';
import { ITelegramUser } from '../models/user.model';

export function intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const BUCKET_KEY: LocalStorageBuckets = LocalStorageBuckets.TG_AUTH;
    const localStorageService = new LocalStorageService();
    const tgUser = localStorageService.getItem<ITelegramUser>(BUCKET_KEY);

    if (tgUser) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${tgUser.id_token || ''}` }, //
        });
    }
    return next(req);
}
