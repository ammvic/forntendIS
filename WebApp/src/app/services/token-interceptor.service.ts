import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserService } from '@app/services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isApiUrl = request.url.startsWith(environment.webApiUrl);
        if (this.userService.isLoggedIn() && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.userService.getToken()}`
                }
            });
        }

        return next.handle(request);
    }
}