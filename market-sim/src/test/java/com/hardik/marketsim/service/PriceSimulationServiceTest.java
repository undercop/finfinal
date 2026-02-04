package com.hardik.marketsim.service;

import com.hardik.marketsim.model.SimulatedAsset;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PriceSimulationServiceTest {

    @Test
    void pricesShouldChangeAfterUpdate() {
        PriceSimulationService service = new PriceSimulationService();

        // manually initialize (since @PostConstruct won't run here)
        service.init();

        SimulatedAsset assetBefore = service.getAllAssets().iterator().next();
        double oldPrice = assetBefore.getPrice();

        service.updatePrices();

        double newPrice = assetBefore.getPrice();

        assertNotEquals(oldPrice, newPrice,
                "Price should change after updatePrices()");
    }
}