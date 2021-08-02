import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../../../../environments/environment';
import { StudentsRoutes } from './students.routing';
import { StudentSigninComponent } from './student-signin/student-signin.component';
import { StudentSignupComponent } from './student-signup/student-signup.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(StudentsRoutes)
  ],
  declarations: [
    StudentSigninComponent,
    StudentSignupComponent,
    StudentProfileComponent
  ]
})
export class StudentsModule { }
