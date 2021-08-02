import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/auth/teachers/teacher.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'teacher-signin',
  animations: [mainAnimations],
  templateUrl: './teacher-signin.component.html',
  styleUrls: ['./teacher-signin.component.scss']
})
export class TeacherSigninComponent implements OnInit {

  private req : Subscription;
  private postReq : Subscription;
  public teacherLoginForm : FormGroup;

  teacher_email : string;
  teacher_password : string;
  message  : string = localStorage.getItem('loginMessage');
  error  : string = localStorage.getItem('loginError');


  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private teacherService: TeacherService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.teacherLoginForm = this.formBuilder.group({
      'email'      : [null, Validators.compose([Validators.required, Validators.email])],
      'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.req = this.teacherService.getTeacherLoginForm().subscribe((data) => {
      console.log(data);
    });
  }

  loginTeacher(e){
    //get value from form controls
    this.teacher_email    = this.teacherLoginForm.get('email').value;
    this.teacher_password = this.teacherLoginForm.get('password').value;
    
    // initialize inputs
    let body  = {
      'email'    : this.teacher_email,
      'password' : this.teacher_password,
    };

    // Show Spinner
    this.spinner.show();

    // execute http post request
    this.postReq = this.teacherService
    .postLogin(body)
    .subscribe((result) => {
      // if error then throw error result 
      if(result.error){
        console.log("ERROR", result)

        window.scroll(0, 0);
        localStorage.setItem('loginError', result.error);

        this.error = localStorage.getItem('loginError');
        this.spinner.hide();
        return this.router.navigate(['/teacher/signin']);
      } 

      // if no error, execute login validation
      else {
        let data = result;

        localStorage.removeItem('loginError');
        localStorage.setItem('loginMessage', 'Login was successful.');
        localStorage.setItem('token', 'Bearer ' + data.token);
        localStorage.setItem('token_authorization', data.token.replace('Bearer ', ''));

        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('teacher', JSON.stringify({
          _id: result.teacher._id,
          name: result.teacher.name,
          email: result.teacher.email
        }));

        this.teacherLoginForm.reset();
        this.message = localStorage.getItem('loginMessage');
        this.teacherService.setTeacherLogin(true);

        setTimeout(() => {
           /** spinner ends after 2 seconds */
          this.spinner.hide();
          this.router.navigate(['/teacher/profile']);
        }, 2000);
      }
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      this.spinner.hide();
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
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
