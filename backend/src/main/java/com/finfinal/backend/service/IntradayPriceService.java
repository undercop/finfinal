package com.finfinal.backend.service;

import com.finfinal.backend.model.*;
import com.finfinal.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IntradayPriceService {

    private final LivePriceRepository liveRepo;
    private final IntradayPriceRepository intradayRepo;
    private final AssetRepository assetRepo;

    public IntradayPriceService(
            LivePriceRepository liveRepo,
            IntradayPriceRepository intradayRepo,
            AssetRepository assetRepo
    ) {
        this.liveRepo = liveRepo;
        this.intradayRepo = intradayRepo;
        this.assetRepo = assetRepo;
    }

    @Transactional
    public void captureSnapshot() {

        List<LivePrice> livePrices = liveRepo.findAll();

        for (LivePrice live : livePrices) {

            //Save intraday price
            IntradayPrice ip = new IntradayPrice();
            ip.setAssetId(live.getAssetId());
            ip.setPrice(live.getPrice());
            ip.setTimestamp(LocalDateTime.now());
            intradayRepo.save(ip);

            //Sync Asset.currentPrice (for trades)
            assetRepo.findById(live.getAssetId()).ifPresent(asset -> {
                asset.setCurrentPrice(live.getPrice());
                assetRepo.save(asset);
            });
        }
    }

    public List<IntradayPrice> getIntradayPrices(Long assetId) {
        return intradayRepo.findByAssetIdOrderByTimestampAsc(assetId);
    }

    public void purgeOldData() {
        intradayRepo.deleteByTimestampBefore(LocalDateTime.now().minusDays(1));
    }
}

