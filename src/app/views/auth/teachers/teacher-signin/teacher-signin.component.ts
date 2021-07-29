import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/auth/teachers/teacher.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-signin',
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

    // execute http post request
    this.postReq = this.teacherService
    .postLogin(JSON.stringify(body))
    .subscribe((result) => {
      // if error then throw error result 
      if(result.error){
        console.log("ERROR", result)

        window.scroll(0, 0);
        localStorage.setItem('loginError', result.error);

        this.error = localStorage.getItem('loginError');
        //this.error = this.error.split(',').join('<br>');
        return this.router.navigate(['/teacher/signin']);
      } 

      // if no error, execute login validation
      else {
        localStorage.removeItem('loginError');
        localStorage.setItem('loginMessage', 'Login was successful.');
        localStorage.setItem('token', 'Bearer ' + result.token);
        localStorage.setItem('token_authorization', /*'Bearer ' + */result.token.replace('Bearer ', ''));

        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('teacher', JSON.stringify({
          _id: result.teacher._id,
          name: result.teacher.name,
          email: result.teacher.email
        }));

        this.teacherLoginForm.reset();
        this.message = localStorage.getItem('loginMessage');
        this.teacherService.setTeacherLogin(true);
        this.router.navigate(['/teacher/profile']);
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
