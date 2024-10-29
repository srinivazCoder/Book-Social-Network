package com.srinivas.Book.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory,Integer> {
    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.userId = :id
            """)
    Page<BookTransactionHistory> findAllBorrowedBook(Pageable pageable, String id);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.createdBy = :userId
            """)
    Page<BookTransactionHistory> findAllReturnedBook(Pageable pageable, Integer userId);

    @Query("""
                SELECT CASE WHEN COUNT(bth) > 0 THEN TRUE ELSE FALSE END
                FROM BookTransactionHistory bth
                WHERE bth.userId = :userId
                AND bth.book.id = :bookId
                AND bth.returnApproved = false
            """)
    boolean isAlreadyBorrowedByUser(@Param("bookId") Integer bookId, @Param("userId")  String userId);


    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.userId = :id
            AND transaction.book.id = :bookId
            AND transaction.returned = false
            AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(Integer bookId, String id);

    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.createdBy = :id
            AND transaction.book.id = :bookId
            AND transaction.returned = true
            AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(Integer bookId, Integer id);
}
