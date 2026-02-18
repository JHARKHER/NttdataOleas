package com.nttdata.customer.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@MappedSuperclass
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String gender;
    private String identification;
    private String address;
    private String phone;
}