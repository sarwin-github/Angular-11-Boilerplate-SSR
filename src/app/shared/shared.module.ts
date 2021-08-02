import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
//import { Http } from '@angular/http';
import { HeaderComponent } from './components/header/header.component';
import { CustomProfileLoaderComponent } from './components/custom-profile-loader/custom-profile-loader.component';
import { HttpClientModule } from '@angular/common/http';

const classesToInclude = [
  HeaderComponent,
  CustomProfileLoaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  entryComponents: [classesToInclude],
  providers: [],
  declarations: classesToInclude,
  exports: classesToInclude
})
export class SharedModule { }
