import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "src/environments/kkout.env";
import { UserSignInDto } from "../dto/registerRequest";
import { UserLogInDto } from "../dto/loginRequest";
import { LoginResponce } from "../dto/loginResponce"
import { LocalStorageService } from "ngx-webstorage";
import { Observable, map, tap } from "rxjs";
import { User } from "../model/user";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiUrl:string =environment.apiHost ;
    userEmitter = new EventEmitter();

    raiseUserEmitterEvent(){
        this.userEmitter.emit();
    }

    constructor(private http : HttpClient ,private localStorage: LocalStorageService,private router: Router){
    }

    public checkUsernameExists( username : string ): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiUrl}/auth/checkUsername/${username}`);
    } 

    public registerUser( user : FormData){
        return this.http.post(`${this.apiUrl}/auth/signup`,user , {responseType : 'text'});
    }
    
    public logIn( cred : UserLogInDto ) {
        this.localStorage.clear();
        return this.http.post<LoginResponce>(`${this.apiUrl}/auth/login`,cred)
            .pipe(map(data=> {
                this.localStorage.store('authToken', data.authToken);
                this.localStorage.store('username' , data.username);
                this.localStorage.store('refreshToken', data.refreshToken);
                this.localStorage.store('role',data.role);
                this.localStorage.store('id',data.id);
                this.raiseUserEmitterEvent();
            }));
    }

    public logOut(){
        this.localStorage.clear()
        this.raiseUserEmitterEvent();
    }

    getJwtToken(){
        return this.localStorage.retrieve('authToken');
    }

    getRefreshToken(){
        return this.localStorage.retrieve('refreshToken');
    }

    getUsername(){
        return this.localStorage.retrieve('username');
    }

    getRole():string{
        return this.localStorage.retrieve('role');
    }

    getId(){
        return this.localStorage.retrieve('id');
    }

    refreshToken() {
        const refreshTokenPayload = {
            refreshToken : this.getRefreshToken(),
            username : this.getUsername()
        }
        this.localStorage.clear('authToken');
        return this.http.post<LoginResponce>(`${this.apiUrl}/auth/refresh`,refreshTokenPayload)
            .pipe(tap(response => {
                this.localStorage.store('authToken',response.authToken);
            }, () => {
                this.logOut();
                this.router.navigate(['login'],{queryParams : {expired : true} })
            }));
    }

}