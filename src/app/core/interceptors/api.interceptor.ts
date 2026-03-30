import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = '6as5d4f65as2d1f3asd87f3asf1dg6as8df9asd7f65ads1f635asd4f68sad7f61asdf321asd89g74a9s6f45ga6sd21fw8er4769fs4dag';

    if (token) {
        const colneReq = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        })
        return next(colneReq)
    }
    return next(req)

}