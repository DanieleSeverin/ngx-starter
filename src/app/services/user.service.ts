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

  public user: User | null = null;
  public accessToken = '';
  public refreshToken = '';

  constructor(private router: Router,
    private http: HttpClient,
    )
  {
    let userTmp = localStorage.getItem('currentUser');

    if (userTmp)
    {
    const temp = JSON.parse(userTmp);
    this.user = temp.User;
    this.accessToken = temp.AccessToken;
    this.refreshToken = temp.RefreshToken;
    console.log("User from localStorage: ", this.user);
    }
  }

  signup(user :AuthRequest){
    return this.http.post<AuthResponse>(`${environment.apiUrl}/signup`, user)
      .pipe(
        tap( res => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("Response from signup: ", res);
            this.user = res.user;
            this.accessToken = res.accessToken;
            this.refreshToken = res.refreshToken;
            localStorage.setItem('currentUser', JSON.stringify(res));
        })
    );
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
                this.user = res.user;
                this.accessToken = res.accessToken;
                this.refreshToken = res.refreshToken;
                localStorage.setItem('currentUser', JSON.stringify(res));
            })
        );
  }

  refresh(){
      const body :RefreshRequest = {"refreshToken" : this.refreshToken};
      const url = `${environment.apiUrl}/Authenticate/Refresh`;

      return this.http.post<RefreshResponse>(url, body).pipe(
          tap(
              res => {
                  this.accessToken = res.accessToken;
                  localStorage.setItem('currentUser', JSON.stringify(this.getAuthResponse()));
              }
          )
      )
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.user = null;
    this.accessToken = '';
    this.refreshToken = '';
    this.router.navigate(['/login']);
  }

  getAuthResponse() :AuthResponse {
    return {
      user: this.user!,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    }
  }

}
