import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookResponse } from 'src/app/service/models';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {
  private _book : BookResponse = {};
  private _manage :boolean = false;
  private _bookCover :string | undefined;


  constructor() { }

  get book():BookResponse{
    return this._book;
  }

  @Input()
  set book(value:BookResponse){
    this._book = value;
  }


  get bookCover():string |undefined {
   
    
    if(this._book.cover){ 
      
      return "data:image/jpa;base64, "+ this._book.cover;

    }
    return "https://m.media-amazon.com/images/I/51E2055ZGUL._SY522_.jpg";
  }

  get manage():boolean{
    return this._manage;
  }

  @Input()
  set manage(value:boolean){
    this._manage = value;
  }

  @Output() private share:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private addToWaitingList:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details:EventEmitter<BookResponse> = new EventEmitter<BookResponse>();


  ngOnInit(): void {
  }

  onShowDetails(){
    this.details.emit(this._book);
  }
  onBorrow(){
    
    this.borrow.emit(this._book);
  }

  onAddToWaitingList(){
    this.addToWaitingList.emit(this._book);
  }

  onEdit(){
    this.edit.emit(this._book);
  }

  onShare(){
    this.share.emit(this._book);
  }
  onArchive(){
    this.archive.emit(this._book);
  }

}
