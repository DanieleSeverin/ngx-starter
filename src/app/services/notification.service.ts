import { Inject, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private DURATION = 5000;

  constructor(public snackBar: MatSnackBar, 
              private ngZone: NgZone,
              ) { }
  
  showSuccess(message: string): void {
    this.snackBar.open(message, 'X', {panelClass: ['success-snackbar'], duration: this.DURATION});
  }
  
  showError(message: string): void {
    // The second parameter is the text in the button. 
    // In the third, we send in the css class for the snack bar.
    // ngZone and setTimeout needed to fix a visualization bug

    this.ngZone.run(() => {
      setTimeout(() => {
        this.snackBar.open(message, 'X', {panelClass: ['error-snackbar'], duration: this.DURATION});
      },0);
    });
  }
}
