import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest, AuthenticationResponse } from 'src/app/service/models';
import { AuthenticationService } from 'src/app/service/services';
import { TokenService } from 'src/app/service/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authRequest : AuthenticationRequest={email:"",password:""};
  errorMsg : Array<string> = [];

  constructor(private router: Router, private authService :AuthenticationService, private tokenService:TokenService) { }

  ngOnInit(): void {
  }

  login(){
    this.errorMsg = [];

    this.authService.authenticate({
      body:this.authRequest
    }).subscribe({
      next:(res:AuthenticationResponse)=>{
        localStorage.setItem('userName',this.authRequest.email)
        //todo save the token
        this.tokenService.token = res.token as string;
        this.router.navigate(["books"]);
      },
      error:(err)=>{
        console.log(err);
        if(err.error.validationErrors){
          this.errorMsg = err.error.validationErrors;
        }else{
          this.errorMsg.push(err.error.error);
        }
      }
    })

  }

  register(){

    this.router.navigate(["register"])

  }

}
