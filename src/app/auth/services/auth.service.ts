import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interface/auth-response.interface';
import { User } from '@auth/interface/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  //VERIFICAR AUTENTICACION
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  //registro

  //logout()
  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
