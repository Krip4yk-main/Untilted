import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { UserComponent } from './features/user/user.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { StoreItemDetailsComponent } from './features/store-item-details/store-item-details.component';
import { BucketComponent } from './features/bucket/bucket.component';
import { AdminComponent } from './features/admin/admin.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { environment } from '../environments/environment';

const appTitle: string = environment.title;

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        title: `${appTitle}`,
    },
    {
        path: 'user',
        component: UserComponent,
        title: `User | ${appTitle}`,
        canActivate: [authGuard],
    },
    {
        path: 'bucket',
        component: BucketComponent,
        title: `Bucket | ${appTitle}`,
    },
    {
        path: 'store-item/:id',
        component: StoreItemDetailsComponent,
        title: `Good | ${appTitle}`,
    },
    {
        path: 'admin',
        component: AdminComponent,
        title: `Administation | ${appTitle}`,
        canActivate: [authGuard, roleGuard(['Admin'])],
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
        title: `Not Found | ${appTitle}`,
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: `Not Found | ${appTitle}`,
    },
];
