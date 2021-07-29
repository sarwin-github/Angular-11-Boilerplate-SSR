import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private isStudentLoggedIn: any;
  private server = environment.server;

  private studentStatus = new BehaviorSubject<any>(null || localStorage.getItem('studentLogin'));
  public studentStatus$ = this.studentStatus.asObservable();

  constructor(private http: HttpClient, 
    private router: Router) {
  }

  // error handler
  private handleError(error:any, caught:any): any{
    localStorage.setItem('notFound', 'true');
    throw error;
  }

  // error handler authorize
  private handleErrorAuthorize(error:any, caught:any): any{
    localStorage.setItem('notFound', 'true');
    throw error;
  }

  // Get student login form
  getStudentLoginForm(): Observable<any>{
    return this.http
    .get(`${this.server}/api/user/signin`)
    .pipe(
      map(res => res),
      catchError(this.handleError)
      );
  }

  // post login student
  postLogin(body: any): Observable<any>{
    return this.http
    .post(`${this.server}/api/user/signin`, body, { /*withCredentials : true*/ })
    .pipe(
      map(res => res),
      catchError(this.handleError)
      );
  }

  // get signup form
  getStudentSignupForm(): Observable<any>{
    return this.http
    .get(`${this.server}/api/user/signup`)
    .pipe(
      map(res => res),
      catchError(this.handleError)
      );
  }

  // post signup student
  postSignUp(body: any): Observable<any>{
    return this.http
    .post(`${this.server}/api/user/signup`, body)
    .pipe(
      map(res => res),
      catchError(this.handleError)
      );
  }

  // get login status from session storage
  getStudentProfile(): any {
    return this.http
    .get(`${this.server}/api/user/profile`)
    .pipe(
      map(res => res),
      catchError(this.handleErrorAuthorize)
    );
  }

  // get refresh token
  getRefreshToken(): any {
    if(localStorage.getItem('refreshToken')){
      return this.http
      .post(`${this.server}/api/user/token/refresh`, 
        ({ 
          user: localStorage.getItem('student'),
          refreshToken: localStorage.getItem('refreshToken') 
        })
        )
      .pipe(
        map(res => res),
        catchError(this.handleErrorAuthorize)
       )
    } else return of(false);

  }

  // get login status from session storage
  getStudentLoginStatus(): any  {
    let storedItem:any = localStorage.getItem('studentLogin');

    if(!!storedItem && storedItem != 'false') return true; 
    else return false;
  }

  // logout student
  logoutStudent(): Observable<any>{
    return this.http
    .get(`${this.server}/api/user/logout`)
    .pipe(
      map(res => {
        localStorage.clear();
        this.isStudentLoggedIn = false;
        this.studentStatus.next(undefined);
        this.router.navigate(['/student/signin']);
        return res;
      }),
      catchError(this.handleError)
      );
  }

  // set login status to true in local storage
  setStudentLogin(status: any): void {
    this.studentStatus.next(status);
    localStorage.setItem('studentLogin', status);
    this.isStudentLoggedIn = true;
  }
}
