import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StudentService } from '../../services/auth/students/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(private studentService: StudentService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.studentService.getRefreshToken().pipe(map(result => {
        if(!JSON.parse(JSON.stringify(result)).refreshToken){ 
          localStorage.setItem('loginError', "You are not allowed to access this URL. Please login to continue.");
          localStorage.setItem('returnURL', this.router.url);
          this.studentService.logoutStudent().subscribe(res => res);
          this.router.navigate(['/student/signin']);
          return false;
        }
        else {
          console.log("REFRESH TOKEN", result)
          
          localStorage.setItem('refreshTokenMessage', 'Refresh Token was successful.');
          localStorage.setItem('token', 'Bearer ' + JSON.parse(JSON.stringify(result)).refreshToken);
          return true;
        }
    }));

  }
  
}
