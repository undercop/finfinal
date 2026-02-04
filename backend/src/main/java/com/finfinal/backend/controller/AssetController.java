package com.finfinal.backend.controller;

import com.finfinal.backend.model.Asset;
import com.finfinal.backend.service.AssetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    // Create a new Asset
    @PostMapping
    public Asset create(@RequestBody Asset asset) {
        return assetService.save(asset);
    }

    // Get all Assets
    @GetMapping
    public List<Asset> getAll() {
        return assetService.findAll();
    }
}
