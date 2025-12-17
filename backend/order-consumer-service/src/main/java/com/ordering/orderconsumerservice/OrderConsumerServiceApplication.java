package com.ordering.orderconsumerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {
        "com.ordering.orderconsumerservice",
        "com.ordering.common",
})
@EnableDiscoveryClient
public class OrderConsumerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderConsumerServiceApplication.class, args);
    }

}
