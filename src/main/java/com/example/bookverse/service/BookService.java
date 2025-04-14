package com.example.bookverse.service;

import java.util.List;

import com.example.bookverse.model.Book;

public interface BookService {
    
    List<Book> getAllBooks();
    
    Book getBookById(Long id);
    
    List<Book> getBooksByCategory(String category);
    
    Book saveBook(Book book);
    
    Book updateBook(Long id, Book book);
    
    void deleteBook(Long id);
} 