package com.nttdata.account.infra.kafka.listener;

import com.nttdata.account.infra.kafka.event.CustomerCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CustomerEventListener {

    @KafkaListener(
            topics = "customer-events",
            groupId = "account-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listen(CustomerCreatedEvent event) {
        System.out.println("Received customer event: " + event);
    }
}
