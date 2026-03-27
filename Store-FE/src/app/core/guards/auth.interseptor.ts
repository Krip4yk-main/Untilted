import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStorageBuckets, LocalStorageService } from '../services/local-storage.service';
import { ITelegramUser } from '../models/user.model';
import { CoreAuthService } from '../services/core-auth.service';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { languagesService } from '../../../assets/languages/languages.service';

export function intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const BUCKET_KEY: LocalStorageBuckets = LocalStorageBuckets.TG_AUTH;
    const localStorageService = new LocalStorageService();
    const tgUser = localStorageService.getItem<ITelegramUser>(BUCKET_KEY);

    const coreAuthService: CoreAuthService = inject(CoreAuthService);
    const notificationService: NotificationService = inject(NotificationService);

    if (tgUser) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${tgUser.id_token || ''}` }, //
        });
    }

    return next(req).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            coreAuthService.logout();
            notificationService.show(languagesService.transform('errors', 'unauthorized'));
        }
        return throwError(() => new Error(error.message));
    }));
}
