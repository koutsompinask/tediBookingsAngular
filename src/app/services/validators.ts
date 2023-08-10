import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

export function charsDisallowedValidator(regex : RegExp): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        if(control.value != null){
            if (regex.test(control.value)) return {illegalChar: true}
        }
        return null;
      }
}

export function passwordMatchValidator():ValidatorFn{
    return (form:AbstractControl): ValidationErrors | null => {
        const password : String = form.get("password")?.value;
        const passwordRep : String = form.get("passwordRep")?.value;
        if ( password !== passwordRep){
            return {passwordMissmnatch: true}
        }
        else return null;
    }
}

export function dateSearchValidator():ValidatorFn{
    return (form:AbstractControl): ValidationErrors | null => {
        const from : Date = form.get("from")?.value;
        const to: Date = form.get("to")?.value;
        if (from == null && to == null) return null;
        if ((from == null && to != null) || (from!=null && to==null)) return { bothOrNone : true};   
        const now: Date = new Date();
        if ( from > to ){
            return {fromAfterTo : true}
        }
        else if (new Date(from)< now){
            return {beforeToday : true}
        }
        else return null;
    }
}

// export function emailUsedValidator(user : UserService): AsyncValidatorFn {
//     return (control : AbstractControl) => {
//         return user.findUserByEmail(control.value)
//             .pipe(
//                 map(user => user ? {userExists:true} : null)
//             );
//     }
// }

// export function passwordStrength():ValidatorFn{
//     return (control:AbstractControl): ValidationErrors | null {
//         const password : String = control.value;
    
//     }
// }