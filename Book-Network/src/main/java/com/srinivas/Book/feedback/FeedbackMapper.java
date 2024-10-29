package com.srinivas.Book.feedback;

import com.srinivas.Book.book.Book;
import org.springframework.stereotype.Service;

import java.util.Objects;


@Service
public class FeedbackMapper {

    public Feedback toFeedback(FeedbackRequest request) {
        return Feedback.builder()
                .note(request.note())
                .comment(request.comment())
                .book(
                        Book.builder()
                                .id(request.bookId())
                                .archived(false) //Not required and has no impact :: just to satisfy lambok
                                .shareable(false)//Not required and has no impact :: just to satisfy lambok
                                .build()
                )
                .build();
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback, Integer id) {
            return FeedbackResponse.builder()
                    .note(feedback.getNote())
                    .comment(feedback.getComment())
                    .ownFeedback(Objects.equals(feedback.getCreatedBy(),id))
                    .build();
    }
}
