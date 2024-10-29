import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { BookListComponent } from './pages/book-list/book-list.component';
import { MyBooksComponent } from './pages/my-books/my-books.component';
import { ManageBookComponent } from './pages/manage-book/manage-book.component';
import { BorrowedBookListComponent } from './pages/borrowed-book-list/borrowed-book-list.component';
import { ReturnBooksComponent } from './pages/return-books/return-books.component';
import { AuthGuard } from 'src/app/service/guard/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[AuthGuard],

    children:[
      {
        path:'',
        component:BookListComponent,
        canActivate:[AuthGuard]
      },
      {
        path:'my-books',
        component:MyBooksComponent,
        canActivate:[AuthGuard]
      }
      ,
      {
        path:'my-returned-books',
        component:ReturnBooksComponent,
        canActivate:[AuthGuard]
      },
      {
        path:'my-borrewed-books',
        component:BorrowedBookListComponent,
        canActivate:[AuthGuard]
      }
      ,
      {
        path:'manage',
        component:ManageBookComponent,
        canActivate:[AuthGuard]
      }
      ,
      {
        path:'manage/:bookId',
        component:ManageBookComponent,
        canActivate:[AuthGuard]
      }
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
