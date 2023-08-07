import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';
import { Rating } from '../model/rating';
import { RatingDto } from '../dto/ratingRequest';

@Injectable({
    providedIn: 'root'
})
export class RatingService{
    apiUrl:string =environment.apiHost ;

    constructor(private http:HttpClient){};

    getHostRatings(id: number): Observable<Rating[]> {
        return this.http.get<Rating[]>(`${this.apiUrl}/rating/user/${id}`);
      }

    getAccomodationRatings(id : number): Observable<Rating[]>{
        return this.http.get<Rating[]>(`${this.apiUrl}/rating/${id}`);
    }

    rateAccomodation(rating : RatingDto,id: number){
        return this.http.post(`${this.apiUrl}/rating/${id}`,rating,{responseType : 'text'})
    }
}