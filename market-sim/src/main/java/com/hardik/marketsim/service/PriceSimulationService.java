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

    @Scheduled(fixedRate = 5000)
    public void updatePrices() {
        for (SimulatedAsset asset : assets.values()) {
            double dailyReturn = getDailyReturn(asset.getCategory());
            asset.setPrice(asset.getPrice() * (1 + dailyReturn));
        }
    }

    public Collection<SimulatedAsset> getAllAssets() {
        return assets.values();
    }

    private double getDailyReturn(AssetCategory category) {
        double drift = switch (category) {
            case STOCK -> 0.0005;
            case MF_LARGE -> 0.0004;
            case MF_MID -> 0.00055;
            case MF_SMALL -> 0.0007;
            case GOLD_ETF -> 0.0003;
            case SILVER_ETF -> 0.0004;
        };

        double volatility = switch (category) {
            case STOCK -> 0.015;
            case MF_LARGE -> 0.010;
            case MF_MID -> 0.018;
            case MF_SMALL -> 0.025;
            case GOLD_ETF, SILVER_ETF -> 0.006;
        };

        return drift + (random.nextDouble() * 2 - 1) * volatility;
    }
}