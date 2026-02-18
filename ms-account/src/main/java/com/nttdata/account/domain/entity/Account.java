package com.nttdata.account.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cuenta")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_cuenta", nullable = false, unique = true)
    @JsonProperty("numero_cuenta")
    private String accountNumber;

    @Column(name = "tipo_cuenta", nullable = false)
    @JsonProperty("tipo_cuenta")
    private String accountType;

    @Column(name = "saldo_inicial")
    @JsonProperty("saldo_inicial")
    private BigDecimal initialBalance;

    @Column(name = "estado")
    @JsonProperty("estado")
    private Boolean state;

    @Column(name = "cliente_id", nullable = false)
    @JsonProperty("cliente_id")
    private Long clientId;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Movement> movements;
}
