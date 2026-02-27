import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Token} from '../models/token';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import { share } from 'rxjs/operators';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private registerUrl = 'https://backendis-mjco.onrender.com/api/Users/register';
  private loginUrl = 'https://backendis-mjco.onrender.com/api/Users/login';

  constructor(private http: HttpClient) {
  }

  registerUser(user: User): Observable<Token> {
    let token = this.http.post<Token>(this.registerUrl, user, {headers}).pipe(share());
    token.subscribe(res => {
      localStorage.setItem('token', res.token);
    });
    return token;
  }

  loginUser(user: User): Observable<Token> {
    let token = this.http.post<Token>(this.loginUrl, user, {headers}).pipe(share());
    token.subscribe(res => {
      localStorage.setItem('token', res.token);
    });
    return token;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
