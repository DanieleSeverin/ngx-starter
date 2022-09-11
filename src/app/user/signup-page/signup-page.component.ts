import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse } from 'src/app/models/User';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { createPasswordStrengthValidator } from 'src/app/validators/password-strength.validator';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  AuthResponse :AuthResponse | null = null;

  form = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
    }],
    password: ['', {
      validators: [Validators.minLength(8), createPasswordStrengthValidator()],
    }],
    password_confirmation: ['', {
      validators: [Validators.minLength(8), createPasswordStrengthValidator()],
    }]
  });

  get email(){return this.form.controls['email']}
  get password(){return this.form.controls['password']}
  get password_confirmation(){return this.form.controls['password_confirmation']}

  constructor(private fb: FormBuilder, 
              private _auth: UserService, 
              private notifier: NotificationService,
              private router: Router
              ) { }

  ngOnInit(): void {
  }

  onSubmit(value :any){
    if(value.password !== value.password_confirmation){
      this.notifier.showError('Passwords do not match.');
      return;
    }

    const UserSignin :AuthRequest = {
      email: value.email,
      password: value.password,
    }

    console.log("UserSignin: ", UserSignin);

    this._auth.signup(UserSignin).subscribe(
      (res :AuthResponse) => {
        this.AuthResponse = res;
        this.form.reset();
        this.router.navigate(['/']);
      }
    );
  }

}
