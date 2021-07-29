import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../shared/services/auth/students/student.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'student-profile',
  animations: [mainAnimations],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  private req : Subscription;
  student_data: any = {};

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private studentService: StudentService) { }

  ngOnInit() {
    this.getStudentProfile();
  }

  getStudentProfile(){
    this.req = this.studentService.getStudentProfile()
    .subscribe((result) => {
      this.student_data = result;

      console.log(result)
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      console.log(err)
      this.studentService.logoutStudent();
    });   
  }

  ngOnDestroy(){
    this.req.unsubscribe();
  }


}
