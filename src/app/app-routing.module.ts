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

const appRoute: Routes = [
    {path: '', redirectTo: 'home' , pathMatch: 'full'},
    {path: 'hostAccs', component:AccomodationsComponent},
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