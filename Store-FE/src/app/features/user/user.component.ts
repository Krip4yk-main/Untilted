import { Component, inject } from '@angular/core';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-user',
    imports: [Card],
    templateUrl: './user.component.html',
    styleUrl: './user.component.less',
})
export class UserComponent {

    protected readonly authService: CoreAuthService = inject(CoreAuthService);

}
