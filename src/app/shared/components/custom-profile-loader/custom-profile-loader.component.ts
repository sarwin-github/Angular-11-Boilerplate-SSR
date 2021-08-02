import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'custom-profile-loader',
  templateUrl: './custom-profile-loader.component.html',
  styleUrls: ['./custom-profile-loader.component.scss']
})
export class CustomProfileLoaderComponent implements OnInit {
  @Input() loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
