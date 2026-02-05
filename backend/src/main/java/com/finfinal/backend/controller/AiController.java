package com.finfinal.backend.controller;

import com.finfinal.backend.service.AiAssetSignalService;
import com.finfinal.backend.service.AiRebalancingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiRebalancingService rebalancingService;
    private final AiAssetSignalService assetSignalService;

    public AiController(
            AiRebalancingService rebalancingService,
            AiAssetSignalService assetSignalService
    ) {
        this.rebalancingService = rebalancingService;
        this.assetSignalService = assetSignalService;
    }

    @GetMapping("/rebalance")
    public String getRebalancingAdvice() {
        return rebalancingService.getQuarterlyAdvice();
    }

    @GetMapping("/asset-signal/{assetId}")
    public String getAssetSignal(@PathVariable Long assetId) {
        return assetSignalService.getSignalForAsset(assetId);
    }
}

