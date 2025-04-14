package com.example.bookverse.service;

import com.example.bookverse.dto.NewsletterRequest;
import com.example.bookverse.model.Newsletter;

public interface NewsletterService {
    Newsletter subscribe(NewsletterRequest request);
    boolean unsubscribe(String email);
    boolean isSubscribed(String email);
} 