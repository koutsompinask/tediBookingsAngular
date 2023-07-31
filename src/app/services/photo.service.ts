import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/kkout.env';

@Injectable({
    providedIn: 'root'
})
export class PhotoService{
    apiUrl:string =environment.apiHost ;
    photoUrl : string;

    constructor(private http:HttpClient){};

    getPhotoContent(filename: string): Observable<Blob> {
        // Make an HTTP GET request to fetch the image content as a blob
        return this.http.get(`${this.apiUrl}/photo/${filename}`, { responseType: 'blob' });
      }

    deletePhoto(filename : string){
        return this.http.delete(`${this.apiUrl}/photo/${filename}`,{ responseType: 'text' });
    }
}