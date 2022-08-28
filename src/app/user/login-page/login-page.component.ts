import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRequest } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { createPasswordStrengthValidator } from 'src/app/validators/password-strength.validator';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private _auth: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(value :any){
    const UserLogin :AuthRequest = {
      Email: value.email,
      Password: value.password,
    }

    console.log("UserLogin: ", UserLogin);

    this._auth.login(UserLogin).subscribe(
      res => {
        console.log("Response from login: ", res);
      }
    );
    
    // this.addUser.emit(newUser);
    this.form.reset();
  }

}
