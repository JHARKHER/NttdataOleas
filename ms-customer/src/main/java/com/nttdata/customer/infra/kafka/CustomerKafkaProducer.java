package com.nttdata.customer.infra.kafka;

import com.nttdata.customer.domain.entity.Customer;
import com.nttdata.customer.infra.kafka.event.CustomerCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomerKafkaProducer {

    private final KafkaTemplate<String, CustomerCreatedEvent> kafkaTemplate;

    private static final String TOPIC = "customer-events";

    public void sendCustomerCreatedEvent(Customer customer) {

        CustomerCreatedEvent event = new CustomerCreatedEvent(
                customer.getId(),
                customer.getName(),
                customer.getIdentification()
        );

        log.info("Sending customer created event: {}", event);

        kafkaTemplate.send(TOPIC, event);
    }
}
