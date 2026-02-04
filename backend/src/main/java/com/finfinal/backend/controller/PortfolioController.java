package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.PortfolioSummaryDto;
import com.finfinal.backend.service.PortfolioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // Get portfolio summary
    @GetMapping("/summary")
    public PortfolioSummaryDto getPortfolioSummary() {
        return portfolioService.getPortfolioSummary();
    }
}
