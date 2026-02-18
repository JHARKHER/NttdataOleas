package com.nttdata.account.domain.service;

import com.nttdata.account.domain.entity.Account;
import com.nttdata.account.domain.entity.Movement;
import com.nttdata.account.domain.repository.AccountRepository;
import com.nttdata.account.domain.repository.MovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MovementServiceTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private MovementService movementService;

    private Account testAccount;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .accountNumber("12345")
                .accountType("SAVINGS")
                .initialBalance(new BigDecimal("1000"))
                .state(true)
                .clientId(1L)
                .build();
        accountRepository.save(testAccount);
    }

    @Test
    void testCreditMovement() {
        movementService.createMovement("12345", new BigDecimal("200"), "CREDIT");

        Optional<Account> updatedAccountOpt = accountRepository.findByAccountNumber("12345");
        assertTrue(updatedAccountOpt.isPresent());
        Account updatedAccount = updatedAccountOpt.get();
        assertEquals(new BigDecimal("1200"), updatedAccount.getInitialBalance());

        List<Movement> movements = movementRepository.findAll();
        assertEquals(1, movements.size());

        Movement m = movements.get(0);
        assertEquals(new BigDecimal("200"), m.getValue());
        assertEquals(new BigDecimal("1200"), m.getBalance());
        assertEquals("CREDIT", m.getType());
    }

    @Test
    void testDebitMovement() {
        movementService.createMovement("12345", new BigDecimal("500"), "DEBIT");

        Optional<Account> updatedAccountOpt = accountRepository.findByAccountNumber("12345");
        assertTrue(updatedAccountOpt.isPresent());
        Account updatedAccount = updatedAccountOpt.get();
        assertEquals(new BigDecimal("500"), updatedAccount.getInitialBalance());

        List<Movement> movements = movementRepository.findAll();
        assertEquals(1, movements.size());

        Movement m = movements.get(0);
        assertEquals(new BigDecimal("500"), m.getValue());
        assertEquals(new BigDecimal("500"), m.getBalance());
        assertEquals("DEBIT", m.getType());
    }

    @Test
    void testDebitMovementInsufficientBalance() {
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                movementService.createMovement("12345", new BigDecimal("1500"), "DEBIT")
        );
        assertEquals("Saldo no disponible", exception.getMessage());
    }
}
