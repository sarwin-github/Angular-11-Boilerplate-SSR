import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/auth/teachers/teacher.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'teacher-signup',
  animations: [mainAnimations],
  templateUrl: './teacher-signup.component.html',
  styleUrls: ['./teacher-signup.component.scss']
})
export class TeacherSignupComponent implements OnInit {
  private req     : Subscription;
  private postReq : Subscription;
  private loginReq : Subscription;

  teacher           : ITeacherInput;
  teacherSignupForm : FormGroup;
  message        : string;
  error          : string;

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private teacherService: TeacherService) { 
    this.teacher = <ITeacherInput>{};
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.req = this.teacherService.getTeacherSignupForm().subscribe((data) => {
      console.log(data);
    });

    this.teacherSignupForm = this.formBuilder.group({
      'email'      : [null, Validators.compose([Validators.required, Validators.email])],
      'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirmPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'name'       : [null, Validators.compose([Validators.required])],
      'company'       : [null, Validators.compose([Validators.required])],
      'address'    : [null, Validators.compose([Validators.required])],
      'phone'      : [null, Validators.compose([Validators.required])]
    });
  }

    /* signupTeacher - create new teacher
  * parameter
  *   - @event : event value
  */

  signUpTeacher(e){
    this.teacher.email           = this.teacherSignupForm.get('email').value;
    this.teacher.password        = this.teacherSignupForm.get('password').value;
    this.teacher.confirmPassword = this.teacherSignupForm.get('confirmPassword').value;
    this.teacher.name            = this.teacherSignupForm.get('name').value;
    this.teacher.company         = this.teacherSignupForm.get('company').value;
    this.teacher.address         = this.teacherSignupForm.get('address').value;
    this.teacher.phone           = this.teacherSignupForm.get('phone').value;

    // initialize inputs
    let body  = {
      'email'    : this.teacher.email,
      'password' : this.teacher.password,
      'confirm-password': this.teacher.confirmPassword,
      'name'     : this.teacher.name,
      'company'  : this.teacher.company,
      'address'  : this.teacher.address,
      'phone'    : this.teacher.phone
    };

    // execute http post request
    this.postReq = this.teacherService.postSignUp(body)
    .subscribe((result) => {
      console.log(result)

      // if error then throw error result 
      if(result.error){
        window.scroll(0, 0);
        localStorage.setItem('signupError', result.error);

        this.error = localStorage.getItem('signupError');
        return this.router.navigate(['teacher/signup']);
      } 
      // if no error, execute login validation
      else {
        localStorage.removeItem('signupError');

        // After successful signup execute login request to server
        this.loginTeacher(result, body);
      }
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      console.log(err)
    });    
  }

  // login teacher
  loginTeacher(result, body){
    this.loginReq = this.teacherService.postLogin(JSON.stringify(body))
    .subscribe((teacher) => {
      localStorage.setItem('loginMessage', 'Login was successful.');
      localStorage.setItem('token', 'Bearer ' + teacher.token);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('teacher', JSON.stringify({
        _id: result.teacher._id,
        name: result.teacher.name,
        email: result.teacher.email
      }));

      this.teacherSignupForm.reset();
      this.message = localStorage.getItem('loginMessage');
      this.teacherService.setTeacherLogin(true);
      this.router.navigate(['/teacher/profile']);
    });
  }

  // Clear error message
  onAlertClose(): void {
    localStorage.removeItem('signupError');
    localStorage.removeItem('signupMessage');
    this.error   = undefined;
    this.message = undefined;
  }

  ngOnDestroy(){
    localStorage.removeItem('signupError');
    localStorage.removeItem('signupMessage');

    if(this.postReq) this.postReq.unsubscribe();
    if(this.loginReq) this.loginReq.unsubscribe();
  }

}

interface ITeacherInput{
  name            : string;
  email           : string;
  company         : string;
  password        : string;
  confirmPassword : string;
  address         : string;
  phone           : string;
}