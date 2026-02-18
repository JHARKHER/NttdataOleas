package com.nttdata.account.infra.kafka;

import com.nttdata.account.infra.kafka.event.CustomerCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CustomerKafkaConsumer {

    @KafkaListener(
            topics = "customer-events",
            groupId = "account-group"
    )
    public void consume(CustomerCreatedEvent event) {
        log.info("Received customer event: {}", event);
        // Aquí se puede persistir cliente en ms-account
    }
}
