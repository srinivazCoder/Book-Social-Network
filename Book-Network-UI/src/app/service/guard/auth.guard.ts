import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router,private tokenService :TokenService) {
    
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const tokenService :TokenService = inject(TokenService);
    // const router:Router = inject(Router)

    if(this.tokenService.isTokenNotValid()){
      this.router.navigate(['login'])
      return false;
    }
    return true;
  }
  
}
