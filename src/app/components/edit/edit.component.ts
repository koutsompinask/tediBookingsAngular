import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignInDto } from 'src/app/dto/registerRequest';
import { photo } from 'src/app/model/photo';
import { User } from 'src/app/model/user';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';
import { charsDisallowedValidator } from 'src/app/services/validators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{
  editUserForm : FormGroup;
  profilePic : photo;
  user: User;

  constructor(private userService : UserService, private router : Router){ }

  ngOnInit(): void {
    this.userService.getDetails().subscribe(data => {
      this.user=data;
      this.editUserForm = new FormGroup({
        username: new FormControl(this.user.username,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/\W/)]),
        firstName: new FormControl(this.user.firstName,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
        lastName: new FormControl(this.user.lastName,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
        email: new FormControl(this.user.email,[Validators.required,Validators.email]),
        phone: new FormControl(this.user.phone,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      })
    })
    this.editUserForm = new FormGroup({
      username: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/\W/)]),
      firstName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
      lastName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
      email: new FormControl(null,[Validators.required,Validators.email]),
      phone: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
    })
  }

  onSubmit(){
    const updateRequest:UserSignInDto ={
      username:this.editUserForm.get('username')?.value,
      firstName:this.editUserForm.get('firstName')?.value,
      lastName:this.editUserForm.get('lastName')?.value,
      email:this.editUserForm.get('email')?.value,
      phone:this.editUserForm.get('phone')?.value,
      role:null,
      password:null
    }
    this.userService.updateDetails(this.prepareFormData(updateRequest)).subscribe(
      data => {
        this.router.navigate(['/viewProfile'])
      }, () => {
        console.error("error updating info");
      }
    )
  }

  onFileSelected(event){
    if (event.target.files){
      this.profilePic = {
        file : event.target.files[0]
      }
    }
  }

  prepareFormData (req : UserSignInDto): FormData{
    const formData = new FormData();
    formData.append(
      'regReq',
      new Blob([JSON.stringify(req)],{type: 'application/json'})
    );

    if (this.profilePic){
      formData.append(
        'photo',
        this.profilePic.file,
        this.profilePic.file.name
      );
    }

    return formData;
  }
}
