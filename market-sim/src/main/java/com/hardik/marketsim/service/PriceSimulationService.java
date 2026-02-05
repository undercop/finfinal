package com.hardik.marketsim.service;

import com.hardik.marketsim.config.MarketAssetConfig;
import com.hardik.marketsim.model.AssetCategory;
import com.hardik.marketsim.model.SimulatedAsset;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PriceSimulationService {

    private static final int TICKS_PER_DAY = 4680; // 6.5 x 60 x 60 / 5
    private static final int TRADING_DAYS = 252;

    private final Map<Long, SimulatedAsset> assets = new HashMap<>();
    private final Random random = new Random();
    private final MarketAssetConfig config;

    public PriceSimulationService(MarketAssetConfig config) {
        this.config = config;
    }

    @PostConstruct
    public void init() {
        for (MarketAssetConfig.AssetConfig cfg : config.getAssets()) {
            assets.put(
                    cfg.getId(),
                    new SimulatedAsset(
                            cfg.getId(),
                            cfg.getCategory(),
                            cfg.getBasePrice()
                    )
            );
        }
    }


     // Geometric Brownian Motion scaled to per-tick movement.

    @Scheduled(fixedRate = 5000)
    public void updatePrices() {

        for (SimulatedAsset asset : assets.values()) {

            double dailyDrift = getDailyDrift(asset.getCategory());
            double dailyVolatility = getDailyVolatility(asset.getCategory());


            double perTickDrift = dailyDrift / TICKS_PER_DAY;
            double perTickVol = dailyVolatility / Math.sqrt(TICKS_PER_DAY);

            double shock = (random.nextDouble() * 2 - 1) * perTickVol;

            double returnPerTick = perTickDrift + shock;

            asset.setPrice(asset.getPrice() * (1 + returnPerTick));
        }
    }

    public Collection<SimulatedAsset> getAllAssets() {
        return assets.values();
    }


    private double getDailyDrift(AssetCategory category) {
        double annualReturn = switch (category) {
            case STOCK -> 0.10;        // 10%
            case MF_LARGE -> 0.08;     // 8%
            case MF_MID -> 0.12;       // 12%
            case MF_SMALL -> 0.15;     // 15%
            case GOLD_ETF -> 0.07;     // 7%
            case SILVER_ETF -> 0.08;   // 8%
        };
        return annualReturn / TRADING_DAYS;
    }


    private double getDailyVolatility(AssetCategory category) {
        double annualVolatility = switch (category) {
            case STOCK -> 0.20;
            case MF_LARGE -> 0.15;
            case MF_MID -> 0.22;
            case MF_SMALL -> 0.30;
            case GOLD_ETF -> 0.12;
            case SILVER_ETF -> 0.18;
        };
        return annualVolatility / Math.sqrt(TRADING_DAYS);
    }
}