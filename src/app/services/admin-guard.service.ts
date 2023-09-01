import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn : 'root'
})
export class AdminGuardService implements CanActivate{

    constructor (private authService : AuthService,private router : Router){};
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if (this.authService.getRole().indexOf('ADMIN')>-1){
            return true;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
    
}