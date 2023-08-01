import { Component,OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  user : User;

  constructor(private userServ:UserService){}

  ngOnInit(): void {
    this.userServ.getDetails().subscribe(data => {
      this.user=data;
      console.log(this.user);
    })
  }
  
}
