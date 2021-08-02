import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TeacherService } from '../../services/auth/teachers/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private teacherService: TeacherService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.teacherService.getRefreshToken().pipe(map(result => {
      if(!JSON.parse(JSON.stringify(result)).refreshToken){ 
        localStorage.setItem('loginError', "You are not allowed to access this URL. Please login to continue.");
        localStorage.setItem('returnURL', this.router.url);
        this.teacherService.logoutTeacher().subscribe(res => res);
        this.router.navigate(['/teacher/signin']);
        return false;
      }
      else {
        localStorage.setItem('refreshTokenMessage', 'Refresh Token was successful.');
        localStorage.setItem('token', 'Bearer ' + JSON.parse(JSON.stringify(result)).refreshToken);
        return true;
      }
    }));
  }
  
}
