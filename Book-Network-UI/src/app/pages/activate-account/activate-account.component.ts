import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/services';


@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {

  message:string='';
  isOkay:boolean = true;
  submitted:boolean = false;

  constructor(
    private router :Router, 
    private authService : AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onCodeCompleted(token:string){
      this.confrimAccount(token);
  }
  private confrimAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next:()=>{
        this.message = "Your account has been successfully activated.\n Now you can proceed to login.";
        this.submitted = true;
        this.isOkay = true;

      },
      error:()=>{
        this.message ="Token has been expired or invalid";
        this.submitted = true;
        this.isOkay = false;

      }
    })
  }
  redirectToLogin(){
    this.router.navigate(["login"]);
  }

}
