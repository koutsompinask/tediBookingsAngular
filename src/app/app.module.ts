import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { UsersComponent } from './components/users/users.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseGuardService } from './services/course-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './token-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    UsersComponent,
    SignupComponent,
    ErrorComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
