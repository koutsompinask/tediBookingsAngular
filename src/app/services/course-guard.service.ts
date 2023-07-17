import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import {Observable} from "rxjs"

export class CourseGuardService implements CanActivate{
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        return true;
    }
    
}