import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token = new BehaviorSubject<string | undefined>(undefined);
  private _name = new BehaviorSubject<string>('');

  constructor () {
    const token = localStorage.getItem('token') || undefined;
    this._token.next(token);

    const name = localStorage.getItem('name') || '';
    this._name.next(name);
  }

  set token(value: string | undefined) {
    this._token.next(value);
    localStorage.setItem('token', value || '');
  }

  set name(value: string) {
    this._name.next(value);
    if (value) {
      localStorage.setItem('name', value);
    } else {
      localStorage.removeItem('name');
    }
  }

  get name$() {
    return this._name.asObservable();
  }

  get token(): string | undefined {
    return this._token.value;
  }

  hasValidToken() {
    const token = this.token;

    if(!token) {
      return false;
    }

    const decodedToken = jwtDecode(token);
    const now = Date.now() / 1000;

    if(!decodedToken.exp) {
      return false;
    }
    return decodedToken.exp > now;
  }
}