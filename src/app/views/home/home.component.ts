import { Component, OnInit } from '@angular/core';
import { mainAnimations } from '../../shared/animations/main-animations';

@Component({
  selector: 'app-home',
  animations: [mainAnimations],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'angular-ssr-universal';
  constructor() { }

  ngOnInit(): void {

  }

}
