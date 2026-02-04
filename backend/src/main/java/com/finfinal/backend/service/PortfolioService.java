package com.finfinal.backend.service;

import com.finfinal.backend.DTO.PortfolioSummaryDto;
import com.finfinal.backend.repository.HoldingRepository;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public PortfolioService(AssetRepository assetRepository,
                            PriceHistoryRepository priceHistoryRepository) {
        this.assetRepository = assetRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    public PortfolioSummaryDto getSummary() {

        List<Asset> assets = assetRepository.findAll();

        double totalPortfolioValue = 0.0;
        double oneDayReturnValue = 0.0;
        double projectedValue = 0.0;

        for (Asset asset : assets) {

            double assetCurrentValue =
                    asset.getCurrentPrice() * asset.getQuantity();

            totalPortfolioValue += assetCurrentValue;

            /* ---------------- ONE DAY RETURN ---------------- */

            List<PriceHistory> last2 =
                    priceHistoryRepository.findTop2ByAssetIdOrderByDateDesc(asset.getId());

            if (last2.size() == 2) {
                double todayPrice = last2.get(0).getPrice();
                double yesterdayPrice = last2.get(1).getPrice();

                oneDayReturnValue +=
                        (todayPrice - yesterdayPrice) * asset.getQuantity();
            }

            /* ---------------- PROJECTION (30 DAYS) ---------------- */

            List<PriceHistory> last30 =
                    priceHistoryRepository.findTop30ByAssetIdOrderByDateDesc(asset.getId());

            if (last30.size() >= 2) {
                double cumulativeDailyReturn = 0.0;

                for (int i = 0; i < last30.size() - 1; i++) {
                    double today = last30.get(i).getPrice();
                    double prev = last30.get(i + 1).getPrice();

                    cumulativeDailyReturn += (today - prev) / prev;
                }

                double avgDailyReturn =
                        cumulativeDailyReturn / (last30.size() - 1);

                double projectedAssetValue =
                        assetCurrentValue * (1 + avgDailyReturn * 30);

                projectedValue += projectedAssetValue;
            } else {
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

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

