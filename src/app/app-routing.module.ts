import { NgModule } from '@angular/core';

import { SearchComponent } from './components/search/search.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { EnlistComponent } from './components/host/enlist/enlist.component';
import { AccomodationsComponent } from './components/host/accomodations/accomodations.component';
import { BookingsComponent } from './components/renter/bookings/bookings.component';
import { HomeComponent } from './components/home/home.component';
import { AccomodationDetailsComponent } from './components/accomodation.details/accomodation.details.component';
import { EditAccomodationComponent } from './components/host/edit-accomodation/edit-accomodation.component';
import { InboxComponent } from './components/message/inbox/inbox.component';
import { OutgoingComponent } from './components/message/outgoing/outgoing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportComponent } from './components/export/export.component';
import { AuthenticatedGuardService } from './services/auth-guard.service';
import { HostGuardService } from './services/host-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { RenterGuardService } from './services/renter-guard.service';


const appRoute: Routes = [
    {path: '', redirectTo: 'home' , pathMatch: 'full'},
    {path: 'hostAccs', component:AccomodationsComponent ,canActivate: [HostGuardService]},
    {path: 'viewAccomodation', component: AccomodationDetailsComponent},
    {path: 'inbox', component: InboxComponent ,canActivate: [AuthenticatedGuardService]},
    {path: 'outgoing', component: OutgoingComponent ,canActivate: [AuthenticatedGuardService]},
    {path: 'viewProfile', component: ProfileComponent ,canActivate: [AuthenticatedGuardService]},
    {path: 'editProfile', component: EditComponent ,canActivate: [AuthenticatedGuardService]},
    {path: 'editAccomodation', component: EditAccomodationComponent ,canActivate: [HostGuardService]},
    {path: 'enlist',component : EnlistComponent ,canActivate: [HostGuardService]},
    {path: 'renterBooks', component: BookingsComponent ,canActivate: [RenterGuardService]},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'search', component: SearchComponent},
    {path: 'home', component: HomeComponent},
    {path: 'admin', component: AdminComponent ,canActivate: [AdminGuardService]},
    {path: 'export', component: ExportComponent ,canActivate: [AdminGuardService]},
    {path: '**', component : ErrorComponent}
  ]

@NgModule({
  imports: [RouterModule.forRoot(appRoute)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
