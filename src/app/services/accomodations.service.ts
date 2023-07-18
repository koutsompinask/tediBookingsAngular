import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';
import { SearchDto } from '../dto/searchRequest';

@Injectable({
  providedIn: 'root'
})
export class AccomodationsService {
  apiUrl:string =environment.apiHost ;

  constructor(private http: HttpClient) { }

  getAllRooms(search :SearchDto){
    return this.http.get(`${this.apiUrl}/accomodation/getAll`);
  }
}
