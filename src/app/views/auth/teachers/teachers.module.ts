import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../../../../environments/environment';
import { TeachersRoutes } from './teachers.routing';
import { TeacherSigninComponent } from './teacher-signin/teacher-signin.component';
import { TeacherSignupComponent } from './teacher-signup/teacher-signup.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forChild(TeachersRoutes)
  ],
  declarations: [
    TeacherSigninComponent,
    TeacherSignupComponent,
    TeacherProfileComponent
  ]
})
export class TeachersModule { }
