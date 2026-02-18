package com.nttdata.account.domain.service;

import com.nttdata.account.domain.entity.Account;
import com.nttdata.account.domain.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository repository;

    public Mono<Account> save(Account account) {
        return Mono.fromCallable(() -> repository.save(account))
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Flux<Account> findAll() {
        return Mono.fromCallable(repository::findAll)
                .flatMapMany(Flux::fromIterable)
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Account> findById(Long id) {
        return Mono.fromCallable(() -> repository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Account not found")))
                .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Account> update(Long id, Account account) {
        return Mono.fromCallable(() -> {
            Account existing = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            existing.setAccountNumber(account.getAccountNumber());
            existing.setAccountType(account.getAccountType());
            existing.setInitialBalance(account.getInitialBalance());
            existing.setState(account.getState());

            return repository.save(existing);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<Void> delete(Long id) {
        return Mono.fromRunnable(() -> repository.deleteById(id))
                .subscribeOn(Schedulers.boundedElastic())
                .then();
    }
}
