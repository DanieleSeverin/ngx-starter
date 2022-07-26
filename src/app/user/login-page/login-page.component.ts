import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { createPasswordStrengthValidator } from 'src/app/validators/password-strength.validator';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  AuthResponse :AuthResponse | null = null;

  form = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
    }],
    password: ['', {
      validators: [Validators.minLength(8), createPasswordStrengthValidator()],
    }]
  });

  get email(){return this.form.controls['email']}
  get password(){return this.form.controls['password']}

  constructor(private fb: FormBuilder, private _auth: UserService,private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(value :any){
    const UserLogin :AuthRequest = {
      email: value.email,
      password: value.password,
    }

    console.log("UserLogin: ", UserLogin);

    this._auth.login(UserLogin).subscribe(
      (res :AuthResponse) => {
        this.AuthResponse = res;
        this.form.reset();
        this.router.navigate(['/']);
      }
    );
  }

}
