import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const currentUser = this.userService.User;
        const isLoggedIn = currentUser && this.userService.AccessToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.userService.AccessToken}`
                }
            });
        }

        return next.handle(request);
    }
}
