package com.nttdata.customer.domain.service;

import com.nttdata.customer.domain.entity.Customer;
import com.nttdata.customer.domain.repository.CustomerRepository;
import com.nttdata.customer.infra.kafka.CustomerKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;

    // 🔥 AQUÍ va la inyección del producer
    private final CustomerKafkaProducer kafkaProducer;

    public Mono<Customer> save(Customer customer) {

        return Mono.fromCallable(() -> repository.save(customer))
                .subscribeOn(Schedulers.boundedElastic())
                .doOnSuccess(savedCustomer ->
                        kafkaProducer.sendCustomerCreatedEvent(savedCustomer)
                );
    }

    public Flux<Customer> findAll() {
        return Mono.fromCallable(repository::findAll)
                .flatMapMany(Flux::fromIterable)
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Customer> update(Long id, Customer customer) {
        return Mono.fromCallable(() -> {
                    Customer existing = repository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Customer not found"));

                    existing.setName(customer.getName());
                    existing.setGender(customer.getGender());
                    existing.setIdentification(customer.getIdentification());
                    existing.setAddress(customer.getAddress());
                    existing.setPhone(customer.getPhone());
                    existing.setPassword(customer.getPassword());
                    existing.setState(customer.getState());

                    return repository.save(existing);
                })
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Void> delete(Long id) {
        return Mono.fromRunnable(() -> repository.deleteById(id))
                .subscribeOn(Schedulers.boundedElastic())
                .then();
    }
}
