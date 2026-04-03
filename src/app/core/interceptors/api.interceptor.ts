import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    const clonedReq = token ? req.clone({
        setHeaders: {
            'authorization': `Bearer ${token}`
        }
    }) : req;

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                localStorage.clear();
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};