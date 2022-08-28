import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, retry, switchMap, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { RefreshResponse } from '../models/User';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private userService: UserService, private notifier: NotificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            // retry(1),
            catchError((err: HttpErrorResponse) => {

            console.error(err);
              
            if (err.status === 401 && this.userService.User) {
                return this.handleError401(request, next);
            }
            return throwError(() => err);
          }))
    }

    private handleError401(request: HttpRequest<any>, next: HttpHandler){
      console.log("handleError401");
      
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        const RefreshToken = this.userService.RefreshToken;

        let hasRefreshed = false;
        
        if (RefreshToken)
          return this.userService.refresh().pipe(
            switchMap((token: RefreshResponse) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(token.AccessToken);
              hasRefreshed = true;
              return next.handle(this.RepeatRequest(request, token.AccessToken));
            }),
            catchError((err) => {
              this.isRefreshing = false;
              if(!hasRefreshed){
                this.notifier.showError("Token scaduto. È necessario autenticarsi nuovamente.");
                this.userService.logout();
              } else {
                console.warn("Il token è stato ripristinato, ma la chiamata seguente è fallita.");
                return throwError(() => err);
              }
              return [];
            })
          );
      }

      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.RepeatRequest(request, token)))
      );
    }

    private RepeatRequest(request: HttpRequest<any>, token: string) {
      return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
      });
    }
  }