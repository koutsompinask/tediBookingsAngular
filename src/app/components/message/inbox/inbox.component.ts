import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageDto } from 'src/app/dto/messageRequest';
import { Message } from 'src/app/model/message';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit{
  page: number =1;
  tableSize: number = 5;
  messages : Message[];
  replyMessage : Message;
  conversation : Message[] = new Array();
  replyForm : FormGroup;
  showError : Boolean = false;
  deleteMessage : Message;

  constructor(private messageServ : MessageService,private authServ : AuthService,private router: Router){}

  ngOnInit(): void {
    this.replyForm= new FormGroup({
      replyText : new FormControl(null,Validators.required)
    });
    this.messageServ.getInbox().subscribe(data => {
      this.messages=data;
    } , () => {
      alert("error loading messages");
    })
  }

  read(id : number){
    this.messageServ.read(id).subscribe(data => {
      this.messages.map( msg => {
        if (msg.id === id) {
          this.conversation=[];
          this.replyMessage=msg;
          this.iterateMessages(msg);
          msg.readFlag=true;
        }
      })
    });
  }

  reply(){
    if(!this.replyForm.valid) {
      this.showError=true;
      return;
    }
    const msgReply : MessageDto = {
      message : this.replyForm.get('replyText')?.value,
      receiverId : this.replyMessage.sender.id
    }
    this.messageServ.reply(this.replyMessage.id,msgReply).subscribe(data => {
      alert(data);
      this.closeModal();
      this.router.navigate(['outgoing']);
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

  delete(id:number){
    this.messageServ.delete(id).subscribe(data => {
      alert(data);
      this.messageServ.getInbox().subscribe(data => {
        this.messages=data;
      } , () => {
        alert("error loading messages");
      })
    } , () => {
      alert("error on deleting message!");
    });
  }

}

