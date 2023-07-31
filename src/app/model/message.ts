export class Message{
    id: number;
    message : string;
    timestamp : Date;
    readFlag: boolean;
    replyMessage : Message;
    sender;
    receiver;
}