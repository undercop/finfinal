package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.PortfolioProjectionDto;
import com.finfinal.backend.DTO.PortfolioSummaryDto;
import com.finfinal.backend.service.PortfolioService;
import com.finfinal.backend.service.ProjectionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final ProjectionService projectionService;

    public PortfolioController(PortfolioService portfolioService, ProjectionService projectionService) {
        this.portfolioService = portfolioService;

        this.projectionService = projectionService;
    }



    @GetMapping("/summary")
    public PortfolioSummaryDto getSummary() {
        return portfolioService.getSummary();
    }
    @GetMapping("/projection/1y")
    public PortfolioProjectionDto projection1Y() {
        return projectionService.project(1);
    }

    @GetMapping("/projection/5y")
    public PortfolioProjectionDto projection5Y() {
        return projectionService.project(5);
    }

}
