package com.nttdata.account.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "movimiento")
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha")
    @JsonProperty("fecha")
    private LocalDateTime date;

    @Column(name = "tipo_movimiento", nullable = false)
    @JsonProperty("tipo")
    private String type;

    @Column(name = "valor", nullable = false)
    @JsonProperty("valor")
    private BigDecimal value;

    @Column(name = "saldo", nullable = false)
    @JsonProperty("saldo")
    private BigDecimal balance;

    @ManyToOne
    @JoinColumn(name = "cuenta_id", nullable = false)
    @JsonProperty("cuenta_id")
    private Account account;
}
