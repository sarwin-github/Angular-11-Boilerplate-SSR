import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../shared/services/auth/students/student.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'student-signup',
  animations: [mainAnimations],
  templateUrl: './student-signup.component.html',
  styleUrls: ['./student-signup.component.scss']
})
export class StudentSignupComponent implements OnInit {
  private req     : Subscription;
  private postReq : Subscription;
  private loginReq : Subscription;

  student           : IStudentInput;
  studentSignupForm : FormGroup;
  message        : string;
  error          : string;

    constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private studentService: StudentService) { 
      this.student = <IStudentInput>{};
    }

    ngOnInit() {
      this.createForm();
    }

    createForm(){
      this.req = this.studentService.getStudentSignupForm().subscribe((data) => {
      console.log(data);
    });

      this.studentSignupForm = this.formBuilder.group({
        'email'      : [null, Validators.compose([Validators.required, Validators.email])],
        'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        'confirmPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        'name'       : [null, Validators.compose([Validators.required])],
        'address'    : [null, Validators.compose([Validators.required])],
        'phone'      : [null, Validators.compose([Validators.required])]
      });
    }

    /* signupStudent - create new student
  * parameter
  *   - @event : event value
  */

  signUpStudent(e){
    this.student.email           = this.studentSignupForm.get('email').value;
    this.student.password        = this.studentSignupForm.get('password').value;
    this.student.confirmPassword = this.studentSignupForm.get('confirmPassword').value;
    this.student.name            = this.studentSignupForm.get('name').value;
    this.student.address         = this.studentSignupForm.get('address').value;
    this.student.phone         = this.studentSignupForm.get('phone').value;

    // initialize inputs
      let body  = {
        'email'    : this.student.email,
        'password' : this.student.password,
        'confirm-password': this.student.confirmPassword,
        'name'     : this.student.name,
        'address'  : this.student.address,
        'phone'    : this.student.phone
      };

    // execute http post request
    this.postReq = this.studentService.postSignUp(body)
    .subscribe((result) => {
        // if error then throw error result 
        if(result.error){
          window.scroll(0, 0);
          localStorage.setItem('signupError', result.error);

          this.error = localStorage.getItem('signupError');
            return this.router.navigate(['student/signup']);
        } 
        // if no error, execute login validation
        else {
          localStorage.removeItem('signupError');

          // After successful signup execute login request to server
          this.loginStudent(result, body);
        }
      },
      // If error in server/api temporary navigate to error page
    (err) => {
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      console.log(err)
    });    
  }

  // login student
  loginStudent(result, body){
    this.loginReq = this.studentService.postLogin(JSON.stringify(body))
    .subscribe((student) => {
        localStorage.setItem('loginMessage', 'Login was successful.');
        localStorage.setItem('token', 'Bearer ' + student.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('student', JSON.stringify({
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email
      }));

        this.studentSignupForm.reset();
        this.message = localStorage.getItem('loginMessage');
        this.studentService.setStudentLogin(true);
        this.router.navigate(['/student/profile']);
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

interface IStudentInput{
  name            : string;
  email           : string;
  password        : string;
  confirmPassword : string;
  address         : string;
  phone           : string;
}