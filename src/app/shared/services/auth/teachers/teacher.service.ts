import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private isTeacherLoggedIn: any;
  private server = environment.server;

  private teacherStatus = new BehaviorSubject<any>(null || localStorage.getItem('teacherLogin'));
  public teacherStatus$ = this.teacherStatus.asObservable();

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


    // Get teacher login form
  getTeacherLoginForm(): Observable<any>{
    return this.http
    .get(`${this.server}/api/client/signin`)
    .pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // post login teacher
  postLogin(body: any): Observable<any>{
    return this.http
    .post(`${this.server}/api/client/signin`, body, { /*withCredentials : true*/ })
    .pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // get signup form
  getTeacherSignupForm(): Observable<any>{
    return this.http
    .get(`${this.server}/api/client/signup`)
    .pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // post signup teacher
  postSignUp(body: any): Observable<any>{
    return this.http
    .post(`${this.server}/api/client/signup`, body)
    .pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  // get login status from session storage
  getTeacherProfile(): any {
    return this.http
    .get(`${this.server}/api/client/profile`)
    .pipe(
      map(res => res),
      catchError(this.handleErrorAuthorize)
    );
  }

  // get refresh token
  getRefreshToken(): any {
    if(localStorage.getItem('refreshToken')){
      return this.http
      .post(`${this.server}/api/client/token/refresh`, 
        ({ 
          client: localStorage.getItem('teacher'),
          refreshToken: localStorage.getItem('refreshToken') 
        })
      )
      .pipe(
        map(res => res),
        catchError(this.handleErrorAuthorize)
      );
    } else return of(false);
    
  }

  // get login status from session storage
  getTeacherLoginStatus(): any  {
    let storedItem:any = localStorage.getItem('teacherLogin');

    if(!!storedItem && storedItem != 'false') return true; 
    else return false;
  }

  // logout teacher
  logoutTeacher(): Observable<any>{
    return this.http
    .get(`${this.server}/api/client/logout`)
    .pipe(
      map(res => {
        localStorage.clear();
        this.isTeacherLoggedIn = false;
        this.teacherStatus.next(undefined);
        this.router.navigate(['/teacher/signin']);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // set login status to true in local storage
  setTeacherLogin(status: any): void {
    this.teacherStatus.next(status);
    localStorage.setItem('teacherLogin', status);
    this.isTeacherLoggedIn = true;
  }
}
