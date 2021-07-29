import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../../shared/services/auth/teachers/teacher.service';
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'teacher-profile',
  animations: [mainAnimations],
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  private req : Subscription;
  teacher_data: any = {};

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private teacherService: TeacherService) { }

  ngOnInit() {
    this.getClientProfile();
  }

  getClientProfile(){
    this.req = this.teacherService.getTeacherProfile()
    .subscribe((result) => {
      this.teacher_data = result;
      console.log(result)
    },
    // If error in server/api temporary navigate to error page
    (err) => {
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
