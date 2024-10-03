import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalService } from "./local.storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {

    private tokenKey = 'token';

    constructor(private localStorage: LocalService,
                private jwtHelper: JwtHelperService,
                private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let clonedRequest = req;

        const token = this.localStorage.getData(this.tokenKey)

        if (token != null && token.length > 0) {
            const tokenExpirationDate = this.jwtHelper.getTokenExpirationDate(token);

            if (tokenExpirationDate) {
                const timeout = tokenExpirationDate.valueOf() - new Date().valueOf();

                if (timeout <= 0) {
                    this.authService.logout();
                } else {
                    const httpHeader = req.headers.has('Authozation') ? req.headers: req.headers.set('Authorization', `Bearer ${token}`);
                    clonedRequest = req.clone({ headers: httpHeader});
                }
            }
        } else {
            this.authService.logout();
        }

        return next.handle(clonedRequest);
    }
}