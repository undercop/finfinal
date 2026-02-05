package com.finfinal.backend.controller;

import com.finfinal.backend.model.IntradayPrice;
import com.finfinal.backend.service.IntradayPriceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intraday-prices")
@CrossOrigin(origins = "http://localhost:5173")
public class IntradayPriceController {

    private final IntradayPriceService service;

    public IntradayPriceController(IntradayPriceService service) {
        this.service = service;
    }

    @GetMapping("/{assetId}")
    public List<IntradayPrice> getIntradayPrices(@PathVariable Long assetId) {
        return service.getIntradayPrices(assetId);
    }
}