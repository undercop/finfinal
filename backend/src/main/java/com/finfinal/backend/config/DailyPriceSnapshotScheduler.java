package com.finfinal.backend.config;

import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.LivePrice;
import com.finfinal.backend.model.PriceHistory;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.LivePriceRepository;
import com.finfinal.backend.repository.PriceHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class DailyPriceSnapshotScheduler {

    private final LivePriceRepository livePriceRepository;
    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public DailyPriceSnapshotScheduler(
            LivePriceRepository livePriceRepository,
            AssetRepository assetRepository,
            PriceHistoryRepository priceHistoryRepository
    ) {
        this.livePriceRepository = livePriceRepository;
        this.assetRepository = assetRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }
    @Scheduled(cron = "0 0 0 * * *") // midnight
    @Transactional
    public void snapshotDailyPrices() {



        List<LivePrice> livePrices = livePriceRepository.findAll();

        for (LivePrice live : livePrices) {

            Asset asset = assetRepository.findById(live.getAssetId()).orElse(null);
            if (asset == null) continue;

            asset.setLastDayPrice(asset.getCurrentPrice());
            asset.setCurrentPrice(live.getPrice());

            assetRepository.save(asset);

            PriceHistory history = new PriceHistory();
            history.setAsset(asset);
            history.setPrice(live.getPrice());
            history.setDate(LocalDate.now());

            priceHistoryRepository.save(history);
        }
    }
}
