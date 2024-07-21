import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ILogin, ILoginResponse, IRegister } from '../models/user.model';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  register(register: IRegister) : Observable<ILoginResponse>{
    return this.http.post<ILoginResponse>('/api/auth/register', register);
  }
  
  login(login: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/api/auth/login', login);
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error instanceof HttpErrorResponse) {
      // Server or network error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    } else {
      // Client-side or network error
      errorMessage = error.message;
    }
    console.error('Error in AuthService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
 