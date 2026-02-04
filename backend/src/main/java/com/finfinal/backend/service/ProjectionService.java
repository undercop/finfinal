package com.finfinal.backend.service;

import com.finfinal.backend.DTO.PortfolioProjectionDto;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectionService {

    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public ProjectionService(AssetRepository assetRepository,
                             PriceHistoryRepository priceHistoryRepository) {
        this.assetRepository = assetRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    public PortfolioProjectionDto project(int years) {

        List<Asset> assets = assetRepository.findAll();

        double totalCurrentValue = 0.0;
        double totalProjectedValue = 0.0;

        for (Asset asset : assets) {

            double assetCurrentValue =
                    asset.getCurrentPrice() * asset.getQuantity();

            totalCurrentValue += assetCurrentValue;

            List<PriceHistory> last30 =
                    priceHistoryRepository.findTop30ByAssetIdOrderByDateDesc(asset.getId());

            if (last30.size() < 2) {
                totalProjectedValue += assetCurrentValue;
                continue;
            }

            double cumulativeDailyReturn = 0.0;

            for (int i = 0; i < last30.size() - 1; i++) {
                double today = last30.get(i).getPrice();
                double prev = last30.get(i + 1).getPrice();
                cumulativeDailyReturn += (today - prev) / prev;
            }

            double avgDailyReturn =
                    cumulativeDailyReturn / (last30.size() - 1);

            double projectedAssetValue =
                    assetCurrentValue *
                            Math.pow(1 + avgDailyReturn, years * 252);

            totalProjectedValue += projectedAssetValue;
        }

        return new PortfolioProjectionDto(
                years,
                round(totalCurrentValue),
                round(totalProjectedValue)
        );
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
