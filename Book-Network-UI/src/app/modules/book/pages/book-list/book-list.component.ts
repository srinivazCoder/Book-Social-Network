import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookResponse, PageResponseBookResponse } from 'src/app/service/models';
import { BookService } from 'src/app/service/services';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  bookResponse:PageResponseBookResponse = {};
  page: number = 0;
  size: number = 5;
  message : string = '';
  level :string ='success';

  constructor(
    private bookService: BookService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.findAllBooks();
  }


  private findAllBooks(){
    this.bookService.findAllBooks({
      page:this.page,
      size:this.size
    }).subscribe({
      next:(books:PageResponseBookResponse|any)=>{

        // books.content=[
        //   {title:'clean code',authorName:"Robert",owner:"user2",synopsis:"here is the synopsis"},
        //   {title:'clean code 1',authorName:"Robert",owner:"user2",synopsis:"here is the synopsis"},
        //   {title:'clean code 2',authorName:"Robert",owner:"user2",synopsis:"here is the synopsis good morning srinivas hello worlds asjndkfsfsfn asjdnf aosien here is the synopsis good morning srinivas hello worlds asjndkfsfsfn asjdnf aosien "},
        //   {title:'clean code 3',authorName:"Robert",owner:"user2",synopsis:"here is the synopsis",rate:3.5}
        // ];


        // books.totalPages = 5

        this.bookResponse = books;
       
      }
    })
  }

  goToFirstPage(){
    this.page = 0;
    this.findAllBooks();
    
  }

  goToPreviousPage(){
    this.page--;
    this.findAllBooks();
  }

  goToPage(page:number){
     
    this.page = page;
    this.findAllBooks();
  }
  goToNextPage(){
    this.page++;
    this.findAllBooks();
  }

  goToLastPage(){
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllBooks();
  }

  get isLastPage():boolean{
    return this.page == this.bookResponse.totalPages as number - 1;
  }


  borrowBook(book:BookResponse):void{
    this.message = '';
    this.bookService.borrowBook({
      'book-id':book.id as number
    }).subscribe({
      next:()=>{
        this.level = 'success';
        this.message = "Book successfully added to your cart";

      },error:(err)=>{
        console.log(err)
        this.level = 'error';
        this.message = err.error.error;
      }
    })
  }

}
