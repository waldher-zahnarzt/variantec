package com.waldher.variantec.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String phone;
    private String desiredCountry;
    private String doctorReligion;
    private String language;
    private boolean interpreterNeeded;
}
