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

  enlist(enlistRequest : EnlistDto){
    return this.http.post(`${this.apiUrl}/accomodation/enlist`,enlistRequest);
  }

  getAllRooms(search :SearchDto):Observable<Accomodation[]>{
    return this.http.post<Accomodation[]>(`${this.apiUrl}/accomodation/getFiltered`,search);
  }

  getRoomsByOwner():Observable<Accomodation[]>{
    return this.http.get<Accomodation[]>(`${this.apiUrl}/accomodation/getMine`);
  }

}
