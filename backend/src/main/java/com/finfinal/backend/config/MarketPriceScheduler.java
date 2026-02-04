package com.finfinal.backend.config;


import com.finfinal.backend.service.MarketPriceSyncService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MarketPriceScheduler {

    private final MarketPriceSyncService marketPriceSyncService;

    public MarketPriceScheduler(MarketPriceSyncService marketPriceSyncService) {
        this.marketPriceSyncService = marketPriceSyncService;
    }

    @Scheduled(fixedRate = 5000)
    public void pullMarketPrices() {
        System.out.println("SYNCING MARKET PRICES...");
        marketPriceSyncService.syncPrices();
    }
}
