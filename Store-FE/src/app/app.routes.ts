import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { LoginComponent } from './features/login/login.component';
import { UserComponent } from './features/user/user.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { StoreItemDetailsComponent } from './features/store-item-details/store-item-details.component';
import { BucketComponent } from './features/bucket/bucket.component';
import { AdminComponent } from './features/admin/admin.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  { path: 'bucket', component: BucketComponent },
  { path: 'store-item/:id', component: StoreItemDetailsComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admin', 'manager'])],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
