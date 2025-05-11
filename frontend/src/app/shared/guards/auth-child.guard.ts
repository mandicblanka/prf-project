import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
    const r = inject(Router);
    return inject(AuthService).checkAuth().pipe(map(isAuthenticated => {
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
