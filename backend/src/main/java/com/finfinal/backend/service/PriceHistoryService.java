package com.finfinal.backend.service;
import com.finfinal.backend.DTO.PriceHistoryDto;
import java.util.stream.Collectors;

import com.finfinal.backend.config.SchedulerConfig;
import com.finfinal.backend.enums.AssetCategory;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.repository.PriceHistoryRepository;
import com.finfinal.backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class PriceHistoryService {

    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private double getAnnualReturn(AssetCategory category) {
        return switch (category) {
            case STOCK -> 0.12;
            case MF_LARGE -> 0.11;
            case MF_MID -> 0.14;
            case MF_SMALL -> 0.18;
            case GOLD_ETF -> 0.08;
            case SILVER_ETF -> 0.10;
        };
    }

    public PriceHistoryService(AssetRepository assetRepository,
                               PriceHistoryRepository priceHistoryRepository) {
        this.assetRepository = assetRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }
    public List<PriceHistoryDto> getHistoryForAsset(Long assetId) {
        List<PriceHistory> historyList = priceHistoryRepository.findByAssetIdOrderByDateAsc(assetId);

        return historyList.stream()
                .map(h -> new PriceHistoryDto(h.getDate(), h.getPrice()))
                .collect(Collectors.toList());
    }

    public void generate365DaysHistory() {

        List<Asset> assets = assetRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Asset asset : assets) {

            double price = asset.getLastDayPrice();
            double annualReturn = getAnnualReturn(asset.getCategory());
            double dailyDrift = annualReturn / 252;

            for (int i = 365; i >= 1; i--) {

                // volatility: ±1.2%
                double noise = (Math.random() * 2 - 1) * 0.012;

                double dailyReturn = dailyDrift + noise;
                price = price * (1 + dailyReturn);

                PriceHistory history = new PriceHistory();
                history.setAsset(asset);
                history.setDate(today.minusDays(i));
                history.setPrice(round(price));

                priceHistoryRepository.save(history);
            }
        }
    }


    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
