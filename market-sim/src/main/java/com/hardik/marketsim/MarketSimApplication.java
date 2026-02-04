package com.hardik.marketsim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MarketSimApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketSimApplication.class, args);
    }
}