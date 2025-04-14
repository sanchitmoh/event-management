package com.example.bookverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookverse.dto.MessageResponse;
import com.example.bookverse.dto.NewsletterRequest;
import com.example.bookverse.model.Newsletter;
import com.example.bookverse.service.NewsletterService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @SuppressWarnings("unused")
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody NewsletterRequest request) {
        try {
            Newsletter subscription = newsletterService.subscribe(request);
            return ResponseEntity.ok(new MessageResponse("You have been successfully subscribed to our newsletter!"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam String email) {
        boolean success = newsletterService.unsubscribe(email);
        
        if (success) {
            return ResponseEntity.ok(new MessageResponse("You have been unsubscribed from our newsletter."));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email not found in our subscription list."));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkStatus(@RequestParam String email) {
        boolean isSubscribed = newsletterService.isSubscribed(email);
        
        if (isSubscribed) {
            return ResponseEntity.ok(new MessageResponse("You are currently subscribed to our newsletter."));
        } else {
            return ResponseEntity.ok(new MessageResponse("You are not subscribed to our newsletter."));
        }
    }
} 