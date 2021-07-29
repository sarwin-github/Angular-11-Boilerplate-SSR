import { Routes } from '@angular/router';
//import { ProfileComponent } from './profile/profile.component';
import { TeacherSigninComponent } from './teacher-signin/teacher-signin.component';
//import { SignupComponent } from './signup/signup.component';
//import { ClientGuard } from '../../../shared/guard/auth/client.guard';

export const TeachersRoutes: Routes = [
  { 
    path: 'signin',
    component: TeacherSigninComponent
  },
  /*{ 
    path: 'signup', 
    component: SignupComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    //canActivate: [ClientGuard]
  },*/
];
