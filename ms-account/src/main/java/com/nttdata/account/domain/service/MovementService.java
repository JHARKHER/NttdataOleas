package com.nttdata.account.domain.service;

import com.nttdata.account.domain.entity.Account;
import com.nttdata.account.domain.entity.Movement;
import com.nttdata.account.domain.repository.AccountRepository;
import com.nttdata.account.domain.repository.MovementRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MovementService {

    private final AccountRepository accountRepository;
    private final MovementRepository movementRepository;

    public MovementService(AccountRepository accountRepository,
                           MovementRepository movementRepository) {
        this.accountRepository = accountRepository;
        this.movementRepository = movementRepository;
    }

    @Transactional
    public void createMovement(String accountNumber, BigDecimal amount, String type) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a cero");
        }

        Optional<Account> optionalAccount = accountRepository.findByAccountNumber(accountNumber);
        if (optionalAccount.isEmpty()) {
            throw new RuntimeException("Cuenta no encontrada");
        }

        Account account = optionalAccount.get();

        BigDecimal newBalance = account.getInitialBalance();
        if ("CREDIT".equalsIgnoreCase(type)) {
            newBalance = newBalance.add(amount);
        } else if ("DEBIT".equalsIgnoreCase(type)) {
            if (newBalance.compareTo(amount) < 0) {
                throw new RuntimeException("Saldo no disponible");
            }
            newBalance = newBalance.subtract(amount);
        } else {
            throw new RuntimeException("Tipo de movimiento no válido");
        }

        account.setInitialBalance(newBalance);
        accountRepository.save(account);

        Movement movement = Movement.builder()
                .account(account)
                .date(LocalDateTime.now())
                .type(type.toUpperCase())
                .value(amount)
                .balance(newBalance)
                .build();

        movementRepository.save(movement);
    }
}
