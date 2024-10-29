package com.srinivas.Book.book;



import com.srinivas.Book.exception.OperationNotPermittedException;
import com.srinivas.Book.file.FileStorageService;
import com.srinivas.Book.history.BookTransactionHistory;
import com.srinivas.Book.history.BookTransactionHistoryRepository;
import com.srinivas.Book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.srinivas.Book.book.BookSpecification.withOwnerId;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookService {
    private final BookRepository bookRepository;
    private  final BookTransactionHistoryRepository transactionHistoryRepository;
    private final BookMapper bookMapper;
    private  final FileStorageService fileStorageService;
    public Integer save(BookRequest request, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Book book = bookMapper.toBook(request);
        book.setOwner(user);
        return bookRepository.save(book).getId();

    }

    public BookResponse findById(Integer bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(()-> new EntityNotFoundException("No book found with ID:: "+ bookId));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<Book>  books = bookRepository.findAllDisplayableBooks(pageable, user.getId());
        List<BookResponse> bookResponse = books.stream().map(bookMapper::toBookResponse).toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<Book>  books = bookRepository.findAll(withOwnerId(user.getId()),pageable);

        List<BookResponse> bookResponse = books.stream().map(bookMapper::toBookResponse).toList();

        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = transactionHistoryRepository.findAllBorrowedBook(pageable, user.getUsername());

        List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allReturnedBooks = transactionHistoryRepository.findAllReturnedBook(pageable, user.getId());
        System.out.println(user.getId());
        List<BorrowedBookResponse> bookResponse = allReturnedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                allReturnedBooks.getNumber(),
                allReturnedBooks.getSize(),
                allReturnedBooks.getTotalElements(),
                allReturnedBooks.getTotalPages(),
                allReturnedBooks.isFirst(),
                allReturnedBooks.isLast()
        );
    }

    public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));

        User user = ((User) connectedUser.getPrincipal());

        if(!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot update others books shareable status");

        }
        book.setShareable(!book.isShareable());
        bookRepository.save(book);
        return bookId;

    }

    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));

        User user = ((User) connectedUser.getPrincipal());

        if(!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot update others books archived status");
        }

        book.setArchived(!book.isArchived());

        bookRepository.save(book);

        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));

        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("The request book can't be borrowed since it is archived or not shareable");

        }

//        User user = ((User) connectedUser.getPrincipal());

        if(Objects.equals(book.getOwner().getId(), connectedUser.getName())){
            throw new OperationNotPermittedException("You cannot update others books archived status");
        }

        final boolean isAlreadyBorrowed = transactionHistoryRepository.isAlreadyBorrowedByUser(bookId,connectedUser.getName());

        if(isAlreadyBorrowed){
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }

        BookTransactionHistory bookTransactionHistory = BookTransactionHistory
                .builder()
                .userId(connectedUser.getName())
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();



        return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));
        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("The request book can't be borrowed since it is archived or not shareable");
        }

        User user = ((User) connectedUser.getPrincipal());
        System.out.println(book.getOwner().getId());
        System.out.println(user.getId());
        if(Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot borrow or return your own book");
        }

        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository.findByBookIdAndUserId(bookId,user.getEmail())
                .orElseThrow(()-> new OperationNotPermittedException("You did not borrow this book"));

        bookTransactionHistory.setReturned(true);
        return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));
        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("The request book can't be borrowed since it is archived or not shareable");
        }

        User user = ((User) connectedUser.getPrincipal());

        System.out.println(book.getOwner().getId());
        System.out.println(user.getId());

        if(Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot return so that book that you not own");
        }

        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository.findByBookIdAndOwnerId(bookId,user.getId())
                .orElseThrow(()-> new OperationNotPermittedException("The book is not returned yet. You can not approve its return"));

        bookTransactionHistory.setReturnApproved(true);

        return transactionHistoryRepository.save(bookTransactionHistory).getId();

    }

    public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID:: " + bookId));

        User user = ((User) connectedUser.getPrincipal());

        var bookCover = fileStorageService.saveFile(file, user.getId());

        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}
