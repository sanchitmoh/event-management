package com.example.bookverse.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookverse.dto.NewsletterRequest;
import com.example.bookverse.model.Newsletter;
import com.example.bookverse.repository.NewsletterRepository;
import com.example.bookverse.service.NewsletterService;

@Service
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @Override
    @Transactional
    public Newsletter subscribe(NewsletterRequest request) {
        Optional<Newsletter> existingSubscription = newsletterRepository.findByEmail(request.getEmail());
        
        if (existingSubscription.isPresent()) {
            Newsletter subscription = existingSubscription.get();
            // If previously unsubscribed, reactivate
            if (!subscription.isActive()) {
                subscription.setActive(true);
                return newsletterRepository.save(subscription);
            }
            return subscription; // Already subscribed
        }
        
        // New subscription
        Newsletter newSubscription = new Newsletter();
        newSubscription.setEmail(request.getEmail());
        newSubscription.setName(request.getName());
        newSubscription.setActive(true);
        
        return newsletterRepository.save(newSubscription);
    }

    @Override
    @Transactional
    public boolean unsubscribe(String email) {
        Optional<Newsletter> subscription = newsletterRepository.findByEmail(email);
        
        if (subscription.isPresent()) {
            Newsletter sub = subscription.get();
            sub.setActive(false);
            newsletterRepository.save(sub);
            return true;
        }
        
        return false;
    }

    @Override
    public boolean isSubscribed(String email) {
        Optional<Newsletter> subscription = newsletterRepository.findByEmail(email);
        return subscription.isPresent() && subscription.get().isActive();
    }
} 