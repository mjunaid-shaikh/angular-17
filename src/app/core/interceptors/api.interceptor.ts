import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, finalize, throwError } from "rxjs";
import { LoaderService } from "../services/loader.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);
    const loaderService = inject(LoaderService);

    const clonedReq = token ? req.clone({
        setHeaders: {
            'authorization': `Bearer ${token}`
        }
    }) : req;

    loaderService.show();  // show spinner before request

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                localStorage.clear();
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        }),
        finalize(() => {
            loaderService.hide(); // hide spinner after request completes
        })
    );
};