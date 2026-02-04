package com.hardik.marketsim.controller;

import com.hardik.marketsim.model.SimulatedAsset;
import com.hardik.marketsim.service.PriceSimulationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/simulate")
public class SimulationController {

    private final PriceSimulationService service;

    public SimulationController(PriceSimulationService service) {
        this.service = service;
    }

    @GetMapping("/prices")
    public Collection<SimulatedAsset> getPrices() {
        return service.getAllAssets();
    }
}