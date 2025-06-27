// account.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';  // <-- Fix your import path here

// Interfaces for type safety
interface LoginResponse {
  message: string;
  token: string;
  username: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword?: string;
}

interface User {
  id?: string;
  username: string;
  token?: string;
  email?: string;
  fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Try to load user data from localStorage if available
    const userJson = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<User | null>(
      userJson ? JSON.parse(userJson) : null
    );
    this.user = this.userSubject.asObservable();
  }

  // Getter for current user value
  public get userValue(): User | null {
    return this.userSubject.value;
  }

  // Login function
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      catchError(error => {
        const errorMsg = error.error?.message || 'Login failed';
        return throwError(() => new Error(errorMsg));
      }),
      map(response => {
        if (!response.token) {
          throw new Error('Invalid response from server');
        }
        const userData: User = { 
          username: response.username, 
          token: response.token 
        };
        this.storeUserData(userData);
        return userData;
      })
    );
  }

  // Logout function
  logout(): void {
    this.clearUserData();
    this.router.navigate(['/account/login']);
  }

  // Registration function
  register(userData: any) {
  const payload = {
    username: userData.username,
    email: userData.email,
    fullName: userData.fullName,
    password: userData.password
    // ⚠️ confirmPassword is NOT sent
  };

  return this.http.post(`${environment.apiUrl}/auth/register`, payload)
    .pipe(
      catchError(error => {
        const errorMsg = error.error?.message || 'Registration failed';
        return throwError(() => new Error(errorMsg));
      })
    );
}



  // Get all users (example admin function)
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  // Get user by ID
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  // Update user details
  update(id: string, params: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map(response => {
        if (id === this.userValue?.id) {
          const updatedUser = { ...this.userValue, ...params };
          this.storeUserData(updatedUser);
        }
        return response;
      })
    );
  }

  // Delete user
  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map(response => {
        if (id === this.userValue?.id) {
          this.logout();
        }
        return response;
      })
    );
  }

  // Private helper: save user data in localStorage and update BehaviorSubject
  private storeUserData(userData: User): void {
    localStorage.setItem('user', JSON.stringify(userData));
    this.userSubject.next(userData);
  }

  // Private helper: clear localStorage and reset BehaviorSubject
  private clearUserData(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
