import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from "rxjs";
import { LoginResponce } from "./dto/loginResponce";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor{
    
    isTokenRefreshing= false;
    refreshTokenSubject : BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public authService : AuthService){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken=this.authService.getJwtToken();

        if (jwtToken) {
            return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse
                    && (error.status === 403 || error.status === 401)) {
                    return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error);
                }
            }));
        }
        return next.handle(req);
    }

    addToken(req: HttpRequest<any>,jwtToken: any){
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + jwtToken)
        });
    }
    
    private handleAuthErrors(req: HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>>{
        if (!this.isTokenRefreshing){
            this.isTokenRefreshing=true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponce: LoginResponce) => {
                    console.log(refreshTokenResponce);
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(refreshTokenResponce.authToken);
                    return next.handle(this.addToken(req,refreshTokenResponce.authToken));
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.authService.getJwtToken()))
                })
            );
        }

    }
}