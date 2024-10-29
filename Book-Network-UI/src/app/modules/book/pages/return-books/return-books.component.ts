import { Component, OnInit } from '@angular/core';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from 'src/app/service/models';
import { BookService, FeedbackService } from 'src/app/service/services';

@Component({
  selector: 'app-return-books',
  templateUrl: './return-books.component.html',
  styleUrls: ['./return-books.component.scss']
})
export class ReturnBooksComponent implements OnInit {


  returnedBooks: PageResponseBorrowedBookResponse = {};
  page: number = 0;
  size: number = 5;
  message: string = '';
  level: string = 'success';


  constructor(private bookService: BookService, private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.findAllReturnedBooks()
  }


  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({ page: this.page, size: this.size }).subscribe({
      next: (resp: PageResponseBorrowedBookResponse) => {
        console.log(resp);
        this.returnedBooks = resp;

      },
      error: () => {

      }
    })
  }




  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();

  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToPage(page: number) {

    this.page = page;
    this.findAllReturnedBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks.totalPages as number - 1;
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.level = "error";
      this.message = "Book is not yet Returned";
      return
    }

    this.bookService.approveReturnBorrowBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {

        this.level = "success";
        this.message = "Book Returned Approved";
        this.findAllReturnedBooks();

      }
    })
  }

}
