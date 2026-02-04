package com.finfinal.backend.controller;

import com.finfinal.backend.service.PriceHistoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/price-history")
public class PriceHistoryController {

    private final PriceHistoryService priceHistoryService;

    public PriceHistoryController(PriceHistoryService priceHistoryService) {
        this.priceHistoryService = priceHistoryService;
    }

    @PostMapping("/generate")
    public String generatePriceHistory() {
        priceHistoryService.generatePriceHistory();
        return "Price history generation started.";
    }
}
