package com.hardik.marketsim.scheduler;

import com.hardik.marketsim.service.PriceSimulationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PriceUpdateScheduler {

    private final PriceSimulationService service;

    public PriceUpdateScheduler(PriceSimulationService service) {
        this.service = service;
    }

    @Scheduled(fixedRate = 5000) // every 5 seconds
    public void updatePrices() {
        service.updatePrices();
        System.out.println("Market prices updated");
    }
}