import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{
  user: User;
  profilePic: string;

  constructor(private userServ:UserService, private photoServ:PhotoService){}

  ngOnInit(): void{
    this.userServ.getDetails().subscribe(data => {
      this.user=data;
      if (this.user.photoUrl){
        this.photoServ.getPhotoContent(this.user.photoUrl).subscribe(
          (response: Blob) => {
            // Convert the blob to a data URL
            const reader = new FileReader();
            reader.onloadend = () => {
              this.profilePic=(reader.result as string);
            };
            reader.readAsDataURL(response);
          },
          error => {
            console.error('Error fetching photo:', error);
          }
        )
      }
    })
  }
}
