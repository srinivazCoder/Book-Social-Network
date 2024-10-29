package com.srinivas.Book.auth;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotEmpty(message = "FirstName is mandatory")
    @NotBlank(message = "FirstName is mandatory")
    private  String firstname;

    @NotEmpty(message = "LastName is mandatory")
    @NotBlank(message = "LastName is mandatory")
    private String lastname;

    @Email(message = "Email is not formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotBlank(message = "Email is mandatory")

    private String email;

    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters long min")
    private  String password;

}
