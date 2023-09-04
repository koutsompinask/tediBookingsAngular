import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/services/admin.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  page: number =1;
  tableSize: number = 10;
  users:User[];
  userView : User = null;
  profilePic=null;

  constructor(private adminServ : AdminService,private photoServ : PhotoService){}

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

  getPhoto(url : string){
    this.photoServ.getPhotoContent(url).subscribe(
      (response: Blob) => {
        // Convert the blob to a data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          this.profilePic=(reader.result as string);
        };
        reader.readAsDataURL(response);
      },
      error => {
        this.profilePic=null;
        console.error('Error fetching photo:', error);
      }
    );
  }

  getAllUsers(){
    this.adminServ.getAllUsers().subscribe(data =>{
      this.users=data;
    }, () => {
      alert("Something went wrong! :(");
    }
    )
  }

  viewUser(u : User){
    this.userView = u
    if (u.photoUrl!=null) this.getPhoto(u.photoUrl);
    else this.profilePic=null;
  }

}
