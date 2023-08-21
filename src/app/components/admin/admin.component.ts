import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  page: number =1;
  tableSize: number = 10;
  users:User[];

  constructor(private adminServ : AdminService,private router : Router){}

  ngOnInit(): void {
    this.getAllUsers()
  }

  onApprove(id : number) : void{
    this.adminServ.approveUser(id).subscribe(data =>{
      alert("User approved");
      this.getAllUsers()
    }, () => {
      alert("Something went wrong! :(");
    }
    )
  }

  getAllUsers(){
    this.adminServ.getAllUsers().subscribe(data =>{
      this.users=data;
    }, () => {
      alert("Something went wrong! :(");
    }
    )
  }

}
