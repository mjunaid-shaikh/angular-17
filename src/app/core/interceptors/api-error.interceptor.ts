import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = '';

            if (error.error instanceof ErrorEvent) {
                // client side error
                errorMessage = `Client error: ${error.error.message}`;
            } else {
                // server side error
                switch (error.status) {
                    case 400:
                        errorMessage = 'Bad request';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized - Please login again';
                        break
                    case 403:
                        errorMessage = 'Forbidden';
                        break
                    case 404:
                        errorMessage = 'Not found';
                        break
                    case 500:
                        errorMessage = 'Internal server error';
                        break
                    default:
                        errorMessage = `Error code: ${error.status}`
                }
            }
            // console.error('Error:', errorMessage);
            return throwError(() => errorMessage);
        })
    )
}