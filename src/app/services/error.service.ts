import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
        return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
    }

    getClientStack(error: Error): string {
        // return error.stack || 'stack not found';
        return this.router.url + '; ' + error.stack;
    }

    getServerMessage(error: HttpErrorResponse): string {
      let errorMessage = error.error?.message || error.message;
        return errorMessage;
    }

    getServerStack(error: HttpErrorResponse): string {
        // handle stack trace
        return 'stack';
    }
}
