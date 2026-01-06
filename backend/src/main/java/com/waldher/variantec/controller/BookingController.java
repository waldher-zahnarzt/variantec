package com.waldher.variantec.controller;

import com.waldher.variantec.model.Booking;
import com.waldher.variantec.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingRepository repository;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        // Logic for language check
        if (booking.getLanguage() != null && !booking.getLanguage().equalsIgnoreCase("DE")) {
            booking.setInterpreterNeeded(true);
        }
        // Simulation of Magic Link sending (Log)
        System.out.println("SIMULATION: Sending Magic Link to " + booking.getEmail() + " / " + booking.getPhone());
        
        return repository.save(booking);
    }
    
    @GetMapping
    public List<Booking> getAll() {
        return repository.findAll();
    }
}
