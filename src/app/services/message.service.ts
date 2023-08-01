import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/kkout.env";
import { MessageDto } from "../dto/messageRequest";
import { Observable } from 'rxjs';
import { Message } from "../model/message";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    apiUrl:string =environment.apiHost ;

    constructor(private http : HttpClient) {}

    sendMessage(messageReq : MessageDto){
        return this.http.post(`${this.apiUrl}/messages/send`,messageReq,{responseType : 'text'});
    }

    getInbox():Observable<Message[]>{
        return this.http.get<Message[]>(`${this.apiUrl}/messages/getInbox`);
    }

    getOutgoing():Observable<Message[]>{
        return this.http.get<Message[]>(`${this.apiUrl}/messages/getOutgoing`);
    }

    read(id : number){
        return this.http.get(`${this.apiUrl}/messages/read/${id}`,{responseType : 'text'});
    }

    reply(id : number,messageReq : MessageDto){
        return this.http.post(`${this.apiUrl}/messages/reply/${id}`,messageReq,{responseType : 'text'})
    }
}