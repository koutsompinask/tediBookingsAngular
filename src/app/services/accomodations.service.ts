import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';
import { SearchDto } from '../dto/searchRequest';
import { EnlistDto } from '../dto/enlistRequest';
import { Accomodation } from '../model/accomodation';
import { BookingDto } from '../dto/bookingRequest';

@Injectable({
  providedIn: 'root'
})
export class AccomodationsService {
  apiUrl:string =environment.apiHost ;

  constructor(private http: HttpClient) { }

  enlist(enlistRequest : FormData){
    return this.http.post(`${this.apiUrl}/accomodation/enlist`,enlistRequest);
  }

  update(enlistRequest : FormData,id : number){
    return this.http.put(`${this.apiUrl}/accomodation/update/${id}`,enlistRequest);
  }

  getAllRooms(search :SearchDto):Observable<Accomodation[]>{
    return this.http.post<Accomodation[]>(`${this.apiUrl}/accomodation/getFiltered`,search);
  }

  getRoomsByOwner():Observable<Accomodation[]>{
    return this.http.get<Accomodation[]>(`${this.apiUrl}/accomodation/getMine`);
  }

  getRoomById(accid:number):Observable<Accomodation>{
    return this.http.get<Accomodation>(`${this.apiUrl}/accomodation/get/${accid}`);
  }

}
