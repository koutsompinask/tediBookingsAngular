import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './token-interceptor';
import { AdminComponent } from './components/admin/admin.component';
import { EnlistComponent } from './components/host/enlist/enlist.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccomodationsComponent } from './components/host/accomodations/accomodations.component';
import { BookingsComponent } from './components/renter/bookings/bookings.component';
import { HomeComponent } from './components/home/home.component';
import { AccomodationDetailsComponent } from './components/accomodation.details/accomodation.details.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { EditAccomodationComponent } from './components/host/edit-accomodation/edit-accomodation.component';
import { InboxComponent } from './components/message/inbox/inbox.component';
import { DetailsComponent } from './components/details/details.component';
import { OutgoingComponent } from './components/message/outgoing/outgoing.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditComponent } from './components/edit/edit.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { ExportComponent } from './components/export/export.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    SignupComponent,
    ErrorComponent,
    LoginComponent,
    AdminComponent,
    EnlistComponent,
    ProfileComponent,
    AccomodationsComponent,
    BookingsComponent,
    HomeComponent,
    AccomodationDetailsComponent,
    EditAccomodationComponent,
    DetailsComponent,
    InboxComponent,
    OutgoingComponent,
    EditComponent,
    ExportComponent,
    RecommendationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule,
    TooltipModule.forRoot(),
    SlickCarouselModule,
    NgxPaginationModule,
    NgxStarRatingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
