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

const appRoute: Routes = [
    {path: '', redirectTo: 'home' , pathMatch: 'full'},
    {path: 'hostAccs', component:AccomodationsComponent},
    {path: 'viewAccomodation', component: AccomodationDetailsComponent},
    {path: 'inbox', component: InboxComponent},
    {path: 'outgoing', component: OutgoingComponent},
    {path: 'viewProfile', component: ProfileComponent},
    {path: 'editAccomodation', component: EditAccomodationComponent},
    {path: 'enlist',component : EnlistComponent},
    {path: 'renterBooks', component: BookingsComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'search', component: SearchComponent},
    {path: 'home', component: HomeComponent},
    {path: 'admin', component: AdminComponent},
    {path: '**', component : ErrorComponent}
  ]
@NgModule({
    imports : [
        RouterModule.forRoot(appRoute)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule{

}