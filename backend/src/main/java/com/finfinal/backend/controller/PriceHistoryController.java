package com.finfinal.backend.controller;

import com.finfinal.backend.service.PriceHistoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prices")
public class PriceHistoryController {

    private final PriceHistoryService service;

    public PriceHistoryController(PriceHistoryService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public String generateHistory() {
        service.generate365DaysHistory();
        return "Price history generated";
    }
}

