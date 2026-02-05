package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.PriceHistoryDto;
import com.finfinal.backend.service.PriceHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/price-history")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class PriceHistoryController {

    private final PriceHistoryService service;

    public PriceHistoryController(PriceHistoryService service) {
        this.service = service;
    }

    @GetMapping("/{assetId}")
    public ResponseEntity<List<PriceHistoryDto>> getAssetHistory(@PathVariable Long assetId) {
        List<PriceHistoryDto> history = service.getHistoryForAsset(assetId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/generate")
    public String generateHistory() {
        service.generate365DaysHistory();
        return "Price history generated";
    }
}