package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.HoldingDto;
import com.finfinal.backend.service.HoldingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holdings")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping
    public ResponseEntity<List<HoldingDto>> getAllHoldings() {
        List<HoldingDto> holdings = holdingService.getAllHoldings();
        return ResponseEntity.ok(holdings);
    }
}