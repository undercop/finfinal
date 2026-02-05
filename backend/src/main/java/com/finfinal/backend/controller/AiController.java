package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.AiRebalancingService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiRebalancingService service;

    public AiController(AiRebalancingService service) {
        this.service = service;
    }

    @GetMapping("/rebalance")
    public String getRebalancingAdvice() {
        return service.getQuarterlyAdvice();
    }
}