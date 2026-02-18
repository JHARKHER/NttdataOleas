package com.nttdata.customer.infra.api;

import com.nttdata.customer.domain.entity.Customer;
import com.nttdata.customer.domain.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService service;

    @GetMapping
    public Flux<Customer> getAll() { 
        return service.findAll(); 
    }

    @PostMapping
    public Mono<Customer> create(@RequestBody Customer customer) { 
        return service.save(customer); 
    }

    @PutMapping("/{id}")
    public Mono<Customer> update(@PathVariable Long id, @RequestBody Customer customer) { 
        return service.update(id, customer); 
    }

    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable Long id) { 
        return service.delete(id); 
    }
}