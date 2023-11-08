import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  accessToken: string;
  userId: string;
  permissionLevel: number;
  boardingLevel: number;
}

export interface User {
  userId: string;
  permissionLevel: number;
  boardingLevel: number;
}

export interface RegisterResponse {
  accessToken: string;
  userId: string;
  permissionLevel: number;
  boardingLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);
  private readonly tokenKey = 'accessToken';

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.checkTokenOnStartup();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      map((response) => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        const user = jwtDecode<User>(response.accessToken); // Decode user information from token
        this.userSubject.next(user); // Update user subject
        this.isAuthenticated.next(true);
        return response;
      })
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, { firstName, lastName, email, password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.next(false);
  }

  get isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem(this.tokenKey);
    const isTokenValid = token ? this.validateToken(token) : false;
    this.isAuthenticated.next(isTokenValid);
    return this.isAuthenticated.asObservable();
  }

  private checkTokenOnStartup(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.validateToken(token)) {
      const user = jwtDecode<User>(token); // Decode the user details from the token
      this.userSubject.next(user); 
    } else {
      this.isAuthenticated.next(false);
    }
  }
  
  private validateToken(token: string): boolean {
    try {
      const decoded: any = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000;
      console.log('decoded.exp', decoded.exp);
      console.log('currentTime', currentTime);
      if (decoded.exp < currentTime) {
        console.log('Token is expired');
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
        return false;
      }
      this.userSubject.next(decoded);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  get user(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}
