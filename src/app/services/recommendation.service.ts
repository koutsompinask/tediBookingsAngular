import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';
import { Accomodation } from '../model/accomodation';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  
  private apiUrl:string =environment.apiHost ;

  constructor(private http: HttpClient) { }

  getReccomendations():Observable<Accomodation[]>{
    return this.http.get<Accomodation[]>(`${this.apiUrl}/recommend`);
  }

}
