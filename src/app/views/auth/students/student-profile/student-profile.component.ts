import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../../shared/services/auth/students/student.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'student-profile',
  animations: [mainAnimations],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  private req : Subscription;
  public loading: boolean = true;
  public student_data: any = {};

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private studentService: StudentService) { }

  ngOnInit() {
    this.getStudentProfile();
  }

  getStudentProfile(){

    this.req = this.studentService.getStudentProfile()
    .subscribe((result) => {
      setTimeout(() => this.loading = false, 2000);
      this.student_data = result;
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      this.spinner.hide();
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      this.studentService.logoutStudent();
    });   
  }

  ngOnDestroy(){
    this.req.unsubscribe();
  }


}
