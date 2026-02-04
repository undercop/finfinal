package com.finfinal.backend.service;


import com.finfinal.backend.DTO.SimulatedPriceDto;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MarketPriceSyncService {

    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final MarketSimClient marketSimClient;

    public MarketPriceSyncService(
            AssetRepository assetRepository,
            PriceHistoryRepository priceHistoryRepository,
            MarketSimClient marketSimClient) {

        this.assetRepository = assetRepository;
        this.priceHistoryRepository = priceHistoryRepository;
        this.marketSimClient = marketSimClient;
    }

    @Transactional
    public void syncPrices() {

        List<SimulatedPriceDto> prices = marketSimClient.fetchPrices();

        for (SimulatedPriceDto dto : prices) {

            Asset asset = assetRepository.findById(dto.getId()).orElse(null);
            if (asset == null) continue;

            asset.setLastDayPrice(asset.getCurrentPrice());
            asset.setCurrentPrice(dto.getPrice());
            assetRepository.save(asset);

            PriceHistory history = new PriceHistory();
            history.setAsset(asset);
            history.setPrice(dto.getPrice());
            history.setDate(LocalDate.now());

            priceHistoryRepository.save(history);
        }
    }
}