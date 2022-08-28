import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

const modules = [
  CommonModule,
  UserRoutingModule,
  SharedModule
];

const components = [
  LoginPageComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    ...modules
  ]
})
export class UserModule { }
