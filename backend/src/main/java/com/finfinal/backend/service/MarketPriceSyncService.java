package com.finfinal.backend.service;


import com.finfinal.backend.DTO.SimulatedPriceDto;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.LivePrice;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.LivePriceRepository;
import com.finfinal.backend.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarketPriceSyncService {

    private final AssetRepository assetRepository;
    private final LivePriceRepository livePriceRepository;
    private final MarketSimClient marketSimClient;

    public MarketPriceSyncService(
            AssetRepository assetRepository,
            LivePriceRepository livePriceRepository,
            MarketSimClient marketSimClient) {

        this.assetRepository = assetRepository;
        this.livePriceRepository = livePriceRepository;
        this.marketSimClient = marketSimClient;
    }

    @Transactional
    public void syncPrices() {

        List<SimulatedPriceDto> prices = marketSimClient.fetchPrices();

        for (SimulatedPriceDto dto : prices) {

            Long assetId = dto.getId();
            if (assetId == null) continue;

            LivePrice livePrice = livePriceRepository
                    .findById(assetId)
                    .orElseGet(() -> {
                        LivePrice lp = new LivePrice();
                        lp.setAssetId(assetId);
                        return lp;
                    });

            livePrice.setPrice(dto.getPrice());
            livePrice.setUpdatedAt(LocalDateTime.now());

            livePriceRepository.save(livePrice);
        }
    }
}