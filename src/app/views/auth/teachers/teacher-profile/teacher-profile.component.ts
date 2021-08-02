import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/auth/teachers/teacher.service';
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'teacher-profile',
  animations: [mainAnimations],
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  private req : Subscription;
  public loading:boolean = true;
  public teacher_data: any = {};

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private teacherService: TeacherService) { }

  ngOnInit() {
    this.getClientProfile();
  }

  getClientProfile(){
    // show spinner
    this.req = this.teacherService.getTeacherProfile()
    .subscribe((result) => {
      setTimeout(() => this.loading = false, 2000);
      this.teacher_data = result;
    },
    // If error in server/api temporary navigate to error page
    (err) => {
      this.spinner.hide();
      localStorage.setItem('sessionError', err);
      localStorage.setItem('sessionUrl', this.router.url);
      console.log(err)
      this.teacherService.logoutTeacher();
    });   
  }

  ngOnDestroy(){
    this.req.unsubscribe();
  }


}
