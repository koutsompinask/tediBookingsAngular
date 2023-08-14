import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/kkout.env";
import { User } from "../model/user";
import { Observable } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class AdminService{

    apiUrl:string =environment.apiHost ;

    constructor(private http: HttpClient){}

    public approveUser(id : number):Observable<User>{
        return this.http.get<User>(`${this.apiUrl}/admin/approve/${id}`)
    }

    public getAllUsers():Observable<User[]>{
        return this.http.get<User[]>(`${this.apiUrl}/admin/getAll`);
    }

    public exportAccomodationsJson(){
        return this.http.get(`${this.apiUrl}/admin/download/accomodations/json`);
    }

    public exportAccomodationsXml():Observable<any>{
        return this.http.get(`${this.apiUrl}/admin/download/accomodations/xml`,{ responseType: 'text' });
    }

    public exportBookingsJson(){
        return this.http.get(`${this.apiUrl}/admin/download/bookings/json`);
    }

    public exportBookingsXml():Observable<any>{
        return this.http.get(`${this.apiUrl}/admin/download/bookings/xml`,{ responseType: 'text' });
    }

    public exportGuestRatingsJson(){
        return this.http.get(`${this.apiUrl}/admin/download/ratings/guest/json`);
    }

    public exportGuestRatingsXml():Observable<any>{
        return this.http.get(`${this.apiUrl}/admin/download/ratings/guest/xml`,{ responseType: 'text' });
    }

    public exportHostRatingsJson(){
        return this.http.get(`${this.apiUrl}/admin/download/ratings/host/json`);
    }

    public exportHostRatingsXml():Observable<any>{
        return this.http.get(`${this.apiUrl}/admin/download/ratings/host/xml`,{ responseType: 'text' });
    }

}