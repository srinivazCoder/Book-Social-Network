import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rating :number= 0;
  maxRating:number = 5;

  get fullStars():number{
    return Math.floor(this.rating)
  }

  get hasHalfStars():boolean{
    return this.rating % 1 !== 0;
  }

  get emptyStars():number{
    return this.maxRating - Math.ceil(this.rating);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
