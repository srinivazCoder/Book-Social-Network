package com.srinivas.Book.book;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BorrowedBookResponse {
    private Integer id;
    private String title;
    private  String authorName;
    private  String isbn;
    private double rate;
    private boolean returned;
    private boolean returnedApproved;
}
