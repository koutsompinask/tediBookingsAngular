import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageDto } from 'src/app/dto/messageRequest';
import { Message } from 'src/app/model/message';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.css']
})
export class OutgoingComponent implements OnInit{
  page: number =1;
  tableSize: number = 5;
  messages : Message[];
  replyMessage : Message;
  conversation : Message[] = new Array();
  replyForm : FormGroup;
  showError : Boolean = false;

  constructor(private messageServ : MessageService,private authServ : AuthService,private router: Router){}

  ngOnInit(): void {
    this.replyForm= new FormGroup({
      replyText : new FormControl(null,Validators.required)
    });
    this.messageServ.getOutgoing().subscribe(data => {
      this.messages=data;
      console.log(data);
    } , () => {
      alert("error loading messages");
    })
  }

  read(id : number){
    this.messages.map( msg => {
      if (msg.id === id) {
        this.conversation=[];
        this.replyMessage=msg;
        this.iterateMessages(msg);
        msg.readFlag=true;
      }
    })
  }

  reply(){
    if(!this.replyForm.valid) {
      this.showError=true;
      return;
    }
    const msgReply : MessageDto = {
      message : this.replyForm.get('replyText')?.value,
      receiverId : this.replyMessage.receiver.id
    }
    this.messageServ.reply(this.replyMessage.id,msgReply).subscribe(data => {
      alert(data);
      this.closeModal();
      this.messageServ.getOutgoing().subscribe(data => {
        this.messages=data;
        console.log(data);
      } , () => {
        alert("error loading messages");
      })
    } , () => {
      alert("error replying");
    } )
  }

  iterateMessages(message: Message) {
    if (message.replyMessage !== null) {
      this.iterateMessages(message.replyMessage);
    }
    this.conversation.push(message);
  }

  checkMine(msg : Message){
    if (msg.sender.id === this.authServ.getId()) return true;
    else return false;
  }

  closeModal() {
    const modal = document.getElementById('viewModal');
    if (modal) {
      modal.classList.remove('show'); // Hide the modal
      modal.style.display = 'none'; // Prevent it from taking up space in the layout
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove(); // Remove the modal backdrop
      }
      document.body.classList.remove('modal-open'); // Restore scrolling on the body
    }
  }

}