import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../shared/services/auth/students/student.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'student-signin',
  animations: [mainAnimations],
  templateUrl: './student-signin.component.html',
  styleUrls: ['./student-signin.component.scss']
})
export class StudentSigninComponent implements OnInit {

  private req : Subscription;
  private postReq : Subscription;
  public studentLoginForm : FormGroup;

  student_email : string;
  student_password : string;
  message  : string = localStorage.getItem('loginMessage');
  error  : string = localStorage.getItem('loginError');


  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private studentService: StudentService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.studentLoginForm = this.formBuilder.group({
      'email'      : [null, Validators.compose([Validators.required, Validators.email])],
      'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.req = this.studentService.getStudentLoginForm().subscribe((data) => {
      console.log(data);
    });
  }

  loginStudent(e){
    //get value from form controls
    this.student_email    = this.studentLoginForm.get('email').value;
    this.student_password = this.studentLoginForm.get('password').value;
    
    // initialize inputs
    let body  = {
      'email'    : this.student_email,
      'password' : this.student_password,
    };

    // execute http post request
    this.postReq = this.studentService
    .postLogin(body)
    .subscribe((result) => {
      // if error then throw error result 
      if(result.error){
        console.log("ERROR", result)

        window.scroll(0, 0);
        localStorage.setItem('loginError', result.error);

        this.error = localStorage.getItem('loginError');
        return this.router.navigate(['/student/signin']);
      } 

      // if no error, execute login validation
      else {
        let data = result;

        console.log(data)

        localStorage.removeItem('loginError');
        localStorage.setItem('loginMessage', 'Login was successful.');
        localStorage.setItem('token', 'Bearer ' + data.token);
        localStorage.setItem('token_authorization', data.token.replace('Bearer ', ''));

        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('student', JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email
        }));

        this.studentLoginForm.reset();
        this.message = localStorage.getItem('loginMessage');
        this.studentService.setStudentLogin(true);
        this.router.navigate(['/student/profile']);
      }
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      console.log(err)
    });    
  }

  // Clear error message
  onAlertClose(): void {
    localStorage.removeItem('loginError');
    localStorage.removeItem('loginMessage');
    this.error   = undefined;
    this.message = undefined;
  }

  ngOnDestroy(){
    localStorage.removeItem('loginError');
    localStorage.removeItem('loginMessage');

    this.req.unsubscribe();
  }


}
