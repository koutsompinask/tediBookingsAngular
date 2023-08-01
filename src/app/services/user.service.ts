import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl:string =environment.apiHost ;

  constructor(private http: HttpClient) { }

  getDetails():Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/user/details`);
  }
}
