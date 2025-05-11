import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const r = inject(Router);
    return inject(AuthService).isAdmin().pipe(map(isAuthenticated => {
        if (!isAuthenticated) {
            r.navigateByUrl('/login');
            return false;
        } else {
            return true;
        }
    }), catchError(error => {
        console.log(error);
        r.navigateByUrl('/login');
        return of(false);
    }));
};
