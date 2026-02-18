package com.nttdata.account.domain.repository;

import com.nttdata.account.domain.entity.Movement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Movement, Long> {

}
