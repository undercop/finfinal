package com.finfinal.backend.config;

import com.finfinal.backend.service.IntradayPriceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class IntradayPriceScheduler {

    private final IntradayPriceService service;

    public IntradayPriceScheduler(IntradayPriceService service) {
        this.service = service;
    }

    // Every 10 seconds
    @Scheduled(fixedRate = 10000)
    public void captureIntradayPrices() {
        service.captureSnapshot();
    }

    // Midnight purge
    @Scheduled(cron = "0 0 0 * * *")
    public void purgeOldIntradayData() {
        service.purgeOldData();
    }
}
