import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { charsDisallowedValidator, passwordMatchValidator } from 'src/app/services/validators';
import { AuthService } from 'src/app/services/auth.service';
import { UserSignInDto } from 'src/app/dto/registerRequest';
import { Router } from '@angular/router';
import { photo } from 'src/app/model/photo';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  registerRequest : UserSignInDto;
  profilePic : photo;
  
  constructor(private authService : AuthService, private router : Router){ }

  roles = [
    {id : 'RENTER', value : 'Renter'},
    {id : 'HOST', value : 'Host'},
    {id : 'HOST_AND_RENTER', value : 'Host & Renter'}
  ]

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/\W/)]),
      firstName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
      lastName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20),charsDisallowedValidator(/[^a-zA-Z]/)]),
      email: new FormControl(null,[Validators.required,Validators.email]),
      passwordCreation: new FormGroup({
        password: new FormControl(null,[Validators.required,Validators.minLength(4),charsDisallowedValidator(/\s/)]),
        passwordRep: new FormControl(null)
      }, passwordMatchValidator()),
      role: new FormControl('RENTER'),
    })
  }

  onSubmit(){
    this.registerRequest={
      username:this.signupForm.get('username')?.value,
      firstName:this.signupForm.get('firstName')?.value,
      lastName:this.signupForm.get('firstName')?.value,
      email:this.signupForm.get('email')?.value,
      password:this.signupForm.get('passwordCreation.password')?.value,
      role:this.signupForm.get('role')?.value
    }
    console.log(this.prepareFormData(this.registerRequest));
    this.authService.registerUser(this.prepareFormData(this.registerRequest)).subscribe( data => {
      console.log(data);
      this.router.navigate(['/home'],{queryParams: {registered : true}});
    }, () => {
      alert('Registration Failed! Please try again')
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
      'user',
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
