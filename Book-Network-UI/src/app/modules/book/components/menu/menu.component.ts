import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userName :string | undefined ;
 
  constructor() { }

  ngOnInit(): void {
    const linkColor = document.querySelectorAll(".nav-link");
    linkColor.forEach((link,index)=>{
      if(window.location.href.endsWith(link.getAttribute('href') || '' )){
        link.classList.remove('active');
        if(index == 0){
          link.classList.add('active');
        }
      }
      link.addEventListener("click",()=>{
        linkColor.forEach((l)=>l.classList.remove('active'));
        link.classList.add('active');
      })
    });

    this.userName = localStorage.getItem("userName")?.split("@")[0]|| undefined;

  }

  logout(){
    localStorage.removeItem('token');
    window.location.reload();
  }

}
