package com.finfinal.backend.service;

import com.finfinal.backend.DTO.PortfolioSummaryDto;
import com.finfinal.backend.DTO.PortfolioDiversificationDto;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.Holding;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.repository.HoldingRepository; // <--- 1. Import This
import com.finfinal.backend.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    // Removed AssetRepository, added HoldingRepository
    private final HoldingRepository holdingRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public PortfolioService(HoldingRepository holdingRepository,
                            PriceHistoryRepository priceHistoryRepository) {
        this.holdingRepository = holdingRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }


    public PortfolioSummaryDto getSummary() {

        // 1. Fetch what the user ACTUALLY owns
        List<Holding> holdings = holdingRepository.findAll();

        double totalPortfolioValue = 0.0;
        double oneDayReturnValue = 0.0;
        double projectedValue = 0.0;

        for (Holding holding : holdings) {

            // Skip empty holdings to avoid unnecessary processing
            if (holding.getQuantity() <= 0) continue;

            Asset asset = holding.getAsset(); // Get the linked Asset details

            // 2. Calculate value using HOLDING quantity * ASSET price
            double assetCurrentValue =
                    asset.getCurrentPrice() * holding.getQuantity();

            totalPortfolioValue += assetCurrentValue;

            /* ---------- ONE DAY RETURN ---------- */

            List<PriceHistory> last2 =
                    priceHistoryRepository
                            .findTop2ByAssetIdOrderByDateDesc(asset.getId());

            if (last2.size() == 2) {
                double todayPrice = last2.get(0).getPrice();
                double yesterdayPrice = last2.get(1).getPrice();

                // Logic: (Price Change) * (User's Quantity)
                oneDayReturnValue +=
                        (todayPrice - yesterdayPrice) * holding.getQuantity();
            }

            /* ---------- PROJECTION (NEXT 30 DAYS) ---------- */

            List<PriceHistory> last30 =
                    priceHistoryRepository
                            .findTop30ByAssetIdOrderByDateDesc(asset.getId());

            if (last30.size() >= 2) {
                double cumulativeDailyReturn = 0.0;

                for (int i = 0; i < last30.size() - 1; i++) {
                    double today = last30.get(i).getPrice();
                    double prev = last30.get(i + 1).getPrice();
                    cumulativeDailyReturn += (today - prev) / prev;
                }

                double avgDailyReturn =
                        cumulativeDailyReturn / (last30.size() - 1);

                // Project the value of THIS holding
                double projectedAssetValue =
                        assetCurrentValue * (1 + avgDailyReturn * 30);

                projectedValue += projectedAssetValue;
            } else {
                // If not enough history, assume flat growth
                projectedValue += assetCurrentValue;
            }
        }

        PortfolioSummaryDto dto = new PortfolioSummaryDto();

        dto.setTotalPortfolioValue(round(totalPortfolioValue));
        dto.setOneDayReturnValue(round(oneDayReturnValue));

        double oneDayReturnPercent =
                totalPortfolioValue == 0
                        ? 0
                        : (oneDayReturnValue / totalPortfolioValue) * 100;

        dto.setOneDayReturn(round(oneDayReturnPercent));
        dto.setProjectedValue(round(projectedValue));

        return dto;
    }

    /* =========================================================
       PORTFOLIO DIVERSIFICATION (Corrected to use Holdings)
       ========================================================= */

    public List<PortfolioDiversificationDto> getDiversification() {

        // 1. Fetch holdings
        List<Holding> holdings = holdingRepository.findAll();
        Map<String, Double> categoryMap = new HashMap<>();

        for (Holding holding : holdings) {

            if (holding.getQuantity() <= 0) continue;

            Asset asset = holding.getAsset();

            // 2. Calculate true value: Holding Qty * Market Price
            double value = asset.getCurrentPrice() * holding.getQuantity();

            String category = asset.getCategory().name();

            categoryMap.put(
                    category,
                    categoryMap.getOrDefault(category, 0.0) + value
            );
        }

        return categoryMap.entrySet()
                .stream()
                .map(entry ->
                        new PortfolioDiversificationDto(
                                entry.getKey(),
                                round(entry.getValue())
                        )
                )
                .toList();
    }

    /* ========================================================= */

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}