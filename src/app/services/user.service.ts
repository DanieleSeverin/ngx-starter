import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthRequest, AuthResponse, RefreshRequest, RefreshResponse, User } from '../models/User';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public User: User | null = null;
  public AccessToken = '';
  public RefreshToken = '';

  constructor(private router: Router,
    private http: HttpClient,
    )
  {
    let userTmp = localStorage.getItem('currentUser');

    if (userTmp)
    {
    const temp = JSON.parse(userTmp);
    this.User = temp.User;
    this.AccessToken = temp.AccessToken;
    this.RefreshToken = temp.RefreshToken;
    console.log("User from localStorage: ", this.User);
    }
  }

  login(body :AuthRequest) {
    const url = `${environment.apiUrl}/login`;

    // this.isLoading = true;
    return this.http.post<AuthResponse>(url, body, {
        headers : {
            "Access-Control-Allow-Origin": "*",
            "Content-Type" : "application/json; charset=UTF-8",
            "dataType" : "json"
        }})
        .pipe(
            tap( res => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log("Response from login: ", res);
                this.User = res.User;
                this.AccessToken = res.AccessToken;
                this.RefreshToken = res.RefreshToken;
                localStorage.setItem('currentUser', JSON.stringify(res));
            })
        );
}

refresh(){
    const body :RefreshRequest = {"RefreshToken" : this.RefreshToken};
    const url = `${environment.apiUrl}/Authenticate/Refresh`;

    return this.http.post<RefreshResponse>(url, body).pipe(
        tap(
            res => {
                this.AccessToken = res.AccessToken;
                localStorage.setItem('currentUser', JSON.stringify(this.getAuthResponse()));
            }
        )
    )
}

  logout() {
    localStorage.removeItem('currentUser');
    this.User = null;
    this.AccessToken = '';
    this.RefreshToken = '';
    this.router.navigate(['/login']);
  }

  getAuthResponse() :AuthResponse {
    return {
      User: this.User!,
      AccessToken: this.AccessToken,
      RefreshToken: this.RefreshToken
    }
  }

}
