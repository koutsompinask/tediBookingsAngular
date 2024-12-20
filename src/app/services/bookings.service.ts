import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/kkout.env";
import { BookingDto } from "../dto/bookingRequest";
import { BookingResponceDto } from "../dto/bookingsResponce";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
    apiUrl:string =environment.apiHost ;
  
    constructor(private http: HttpClient) { }
  
    bookRoom(rooomId: number,bookingRequest: BookingDto){
      return this.http.post(`${this.apiUrl}/book/${rooomId}`,bookingRequest);
    }
  
    getBookings(){
      return this.http.get<BookingResponceDto[]>(`${this.apiUrl}/book/getMine`);
    }

    delete(id : number){
      return this.http.delete(`${this.apiUrl}/book/delete/${id}`,{responseType : 'text'});
    }

    checkBooked(id: number , bookingRequest : BookingDto):Observable<Boolean>{
      return this.http.post<Boolean>(`${this.apiUrl}/book/check/${id}`,bookingRequest);
    }
}
  