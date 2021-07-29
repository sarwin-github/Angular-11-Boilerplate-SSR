import { Routes } from '@angular/router';
import { TeacherSigninComponent } from './teacher-signin/teacher-signin.component';
import { TeacherSignupComponent } from './teacher-signup/teacher-signup.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherGuard } from '../../../shared/guard/auth/teacher.guard';

export const TeachersRoutes: Routes = [
  { 
    path: 'signin',
    component: TeacherSigninComponent
  },
  { 
    path: 'signup', 
    component: TeacherSignupComponent 
  },
  { 
    path: 'profile', 
    component: TeacherProfileComponent,
    canActivate: [TeacherGuard]
  },
];
