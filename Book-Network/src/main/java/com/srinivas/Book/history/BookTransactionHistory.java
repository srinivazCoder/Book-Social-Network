package com.srinivas.Book.history;

import com.srinivas.Book.book.Book;
import com.srinivas.Book.common.BaseEntity;
import com.srinivas.Book.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BookTransactionHistory extends BaseEntity {
    // user relationship
//    @ManyToOne
    @JoinColumn(name = "user_id")
    private String userId;
    // boot relationship
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private boolean returned;

    private boolean returnApproved;


}
