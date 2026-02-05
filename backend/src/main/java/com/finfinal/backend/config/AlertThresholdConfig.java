package com.finfinal.backend.config;

import com.finfinal.backend.enums.AssetCategory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AlertThresholdConfig {

    public double getDropThreshold(AssetCategory category) {
        return switch (category) {
            case STOCK -> -5;
            case MF_LARGE -> -3;
            case MF_MID -> -4;
            case MF_SMALL -> -6;
            case GOLD_ETF -> -2;
            case SILVER_ETF -> -3;
        };
    }

    public double getRiseThreshold(AssetCategory category) {
        return switch (category) {
            case STOCK -> 8;
            case MF_LARGE -> 6;
            case MF_MID -> 7;
            case MF_SMALL -> 10;
            case GOLD_ETF -> 5;
            case SILVER_ETF -> 6;
        };
    }
}