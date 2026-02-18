package com.nttdata.customer.domain.repository;

import com.nttdata.customer.domain.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
