import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/auth/students/student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private req: Subscription;
  loggedInStudent: any;
  loggedInClient: any;

  constructor(private router:Router, 
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService) { 

    this.router.events.subscribe(event => {
      this.studentService.studentStatus$.subscribe(result => {
        this.loggedInStudent = result;
      });

      /*this.clientService.clientStatus$.subscribe(result => {
        this.loggedInClient = result;
      });*/
    });
  }

  ngOnInit() {
  }

  studentLogout(){
    this.req = this.studentService
    .logoutStudent()
    .subscribe((data) => {
      window.scrollTo(0, 0);
    });
  }

  /*clientLogout(){
    this.req = this.clientService
    .logoutClient()
    .subscribe((data) => {
      window.scrollTo(0, 0);
    });
  }*/

  ngOnDestroy(){
    if(this.req) this.req.unsubscribe();
  }

}
