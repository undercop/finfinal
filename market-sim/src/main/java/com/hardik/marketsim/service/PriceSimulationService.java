package com.hardik.marketsim.service;

import com.hardik.marketsim.model.AssetCategory;
import com.hardik.marketsim.model.SimulatedAsset;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PriceSimulationService {

    private final Map<Long, SimulatedAsset> assets = new HashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void init() {
        // Temporary hardcoded assets (IDs must match backend later)
        assets.put(1L, new SimulatedAsset(1L, AssetCategory.STOCK, 100.0));
        assets.put(2L, new SimulatedAsset(2L, AssetCategory.MF_LARGE, 200.0));
        assets.put(3L, new SimulatedAsset(3L, AssetCategory.GOLD_ETF, 500.0));
    }

    public Collection<SimulatedAsset> getAllAssets() {
        return assets.values();
    }

    public void updatePrices() {
        for (SimulatedAsset asset : assets.values()) {
            double changePercent = getVolatility(asset.getCategory());
            double change = asset.getPrice() * changePercent;
            asset.setPrice(asset.getPrice() + change);
        }
    }

    private double getVolatility(AssetCategory category) {
        return switch (category) {
            case STOCK -> randomBetween(-0.02, 0.02);
            case MF_SMALL -> randomBetween(-0.025, 0.025);
            case MF_MID -> randomBetween(-0.018, 0.018);
            case MF_LARGE -> randomBetween(-0.012, 0.012);
            case GOLD_ETF, SILVER_ETF -> randomBetween(-0.005, 0.005);
        };
    }

    private double randomBetween(double min, double max) {
        return min + (max - min) * random.nextDouble();
    }
}