package com.finfinal.backend.service;

import com.finfinal.backend.DTO.AssetSignal;
import com.finfinal.backend.enums.AssetCategory;
import com.finfinal.backend.model.Asset;
import org.springframework.stereotype.Service;

@Service
public class AssetSignalEngine {

    public AssetSignal evaluate(
            Asset asset,
            double allocationPercent,
            String portfolioRisk
    ) {

        AssetSignal signal = new AssetSignal();
        signal.setAssetId(asset.getId());
        signal.setAssetName(asset.getName());
        signal.setCategory(asset.getCategory().name());

        // Overexposure logic
        if (allocationPercent > idealCap(asset.getCategory(), portfolioRisk)) {
            signal.setSignal("REDUCE");
            signal.setRationale(
                    "Allocation exceeds ideal exposure for long-term risk balance."
            );
            return signal;
        }

        // Underexposure logic
        if (allocationPercent < idealFloor(asset.getCategory(), portfolioRisk)) {
            signal.setSignal("BUY");
            signal.setRationale(
                    "Allocation below strategic long-term target."
            );
            return signal;
        }

        signal.setSignal("HOLD");
        signal.setRationale(
                "Asset allocation aligns with long-term portfolio strategy."
        );

        return signal;
    }

    private double idealCap(AssetCategory c, String risk) {
        return switch (risk) {
            case "Aggressive" -> c == AssetCategory.MF_SMALL ? 25 : 30;
            case "Moderate-High" -> 22;
            default -> 18;
        };
    }

    private double idealFloor(AssetCategory c, String risk) {
        return switch (risk) {
            case "Aggressive" -> 5;
            case "Moderate" -> 8;
            default -> 10;
        };
    }
}
