import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogInDto } from 'src/app/dto/loginRequest';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm : FormGroup;
  loginReq : UserLogInDto;
  expired : boolean = false;
  changedUsername : boolean = false;
  changedPassword : boolean = false;

  constructor(private authServ:AuthService, private router: Router,private route: ActivatedRoute){
    this.loginReq={
      username : '',
      password : ''
    }
  }

  ngOnInit(): void {
    this.loginForm= new FormGroup({
      username : new FormControl(null,Validators.required),
      password : new FormControl(null,Validators.required)
    })
    this.route.queryParams.subscribe(params =>{
      this.expired = params['expired'];
      this.changedUsername = params['changedUsername'];
      this.changedPassword = params['changedPassword'];
    });
  }

  onSubmit(){
    this.loginReq={
      username : this.loginForm.get('username')?.value,
      password : this.loginForm.get('password')?.value
    };

    this.authServ.logIn(this.loginReq).subscribe(data => {
      if(this.expired) window.history.back();
      else if (this.changedUsername) this.router.navigate(['/viewProfile'])
      else this.router.navigate(['/home'])
    }, (er) => {
      alert('invalid credentials');
      console.error(er);
    }
    );
  }
}
