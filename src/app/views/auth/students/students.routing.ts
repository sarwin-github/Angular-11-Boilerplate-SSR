import { Routes } from '@angular/router';
import { StudentSigninComponent } from './student-signin/student-signin.component';
import { StudentSignupComponent } from './student-signup/student-signup.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

import { StudentGuard } from '../../../shared/guard/auth/student.guard';

export const StudentsRoutes: Routes = [
  { 
    path: 'signin',
    component: StudentSigninComponent
  },
  { 
    path: 'signup', 
    component: StudentSignupComponent 
  },
  { 
    path: 'profile', 
    component: StudentProfileComponent,
    canActivate: [StudentGuard]
  },
];
