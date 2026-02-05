package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.LivePriceDto;
import com.finfinal.backend.service.LivePriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/live-prices")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class LivePriceController {

    private final LivePriceService service;

    public LivePriceController(LivePriceService service) {
        this.service = service;
    }

    /**
     * Fetch latest live prices for all assets (intraday)
     */
    @GetMapping
    public ResponseEntity<List<LivePriceDto>> getAllLivePrices() {
        return ResponseEntity.ok(service.getAllLivePrices());
    }

    /**git
     * Fetch live price for a single asset (optional but useful)
     */
    @GetMapping("/{assetId}")
    public ResponseEntity<LivePriceDto> getLivePriceForAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(service.getLivePriceForAsset(assetId));
    }
}