import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignInDto } from 'src/app/dto/registerRequest';
import { photo } from 'src/app/model/photo';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';
import { charsDisallowedValidator, passwordMatchValidator } from 'src/app/services/validators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{
  editUserForm : FormGroup;
  profilePic : photo;
  user: User;
  userNameExists : boolean = false;
  usernameChecked : string = '';
  showErrors : boolean = false
  passwordChangeForm : FormGroup;

  constructor(private userService : UserService, private router : Router,private authService : AuthService){ }

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
    this.passwordChangeForm = new FormGroup({
      password: new FormControl(null,[Validators.required,Validators.minLength(4),charsDisallowedValidator(/\s/)]),
      passwordRep: new FormControl(null)
    }, passwordMatchValidator());
  }

  onSubmit(){
    if (!this.editUserForm.valid){
      this.showErrors=true;
      return;
    }
    const newUserName = this.editUserForm.get('username')?.value;
    this.authService.checkUsernameExists(newUserName).subscribe(data => 
      {
        if (data && newUserName != this.authService.getUsername() ) {
          this.userNameExists=true;
          this.usernameChecked=this.editUserForm.get('username')?.value;
          return;
        }
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
            if (this.authService.getUsername()!=newUserName){
              this.authService.logOut();
              this.router.navigate(['/login'],{queryParams: {'changedUsername' : true}});
            }
            else this.router.navigate(['/viewProfile'])
          }, () => {
            console.error("error updating info");
          }
        )
      } ,() => {
        console.error("error updating info");
      }
    );
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

  changePassword(){
    if (!this.passwordChangeForm.valid) {
      this.showErrors=true
      return;
    }
    this.userService.changePassword(this.passwordChangeForm.get('password')?.value).subscribe(data => {
      this.authService.logOut();
      this.router.navigate(['/login'],{queryParams: {'changedPassword' : true}});
    },() => alert('error while changing password'));
  }
}
