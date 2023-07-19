import { NgModule } from '@angular/core';

import { SearchComponent } from './components/search/search.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { EnlistComponent } from './components/host/enlist/enlist.component';

const appRoute: Routes = [
    {path: '', redirectTo: 'home' , pathMatch: 'full'},
    {path: 'enlist',component : EnlistComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: SearchComponent},
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