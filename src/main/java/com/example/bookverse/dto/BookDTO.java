package com.example.bookverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
    private String isbn;
    private String category;
    private Integer publicationYear;
} 