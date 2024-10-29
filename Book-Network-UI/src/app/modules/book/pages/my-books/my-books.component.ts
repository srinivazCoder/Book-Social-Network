import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageResponseBookResponse, BookResponse } from 'src/app/service/models';
import { BookService } from 'src/app/service/services';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnInit {
  bookResponse:PageResponseBookResponse = {};
  page: number = 0;
  size: number = 5;
  

  constructor(
    private bookService: BookService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.findAllBooks();
  }


  private findAllBooks(){
    this.bookService.findAllBooksByOwner({
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


        // books.totalPages = 2

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

  archiveBook(book:BookResponse){
    console.log("called");
    this.bookService.updateArchivedStatus({
      "book-id": book.id as number
    }).subscribe({
      next:()=>{
        console.log(book.archived)
        book.archived != book.archived;
      }
    })
  }
  shareBook(book:BookResponse){
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).subscribe({
      next:()=>{
        book.shareable = !book.shareable;
      }
    })
  }
  editBook(book:BookResponse){
    this.router.navigate(['books','manage',book.id])
  }

}
