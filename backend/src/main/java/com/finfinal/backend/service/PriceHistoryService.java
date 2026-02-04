package com.finfinal.backend.service;

import com.finfinal.backend.config.SchedulerConfig;
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

    private final PriceHistoryRepository priceHistoryRepository;
    private final AssetRepository assetRepository;

    public PriceHistoryService(PriceHistoryRepository priceHistoryRepository, AssetRepository assetRepository) {
        this.priceHistoryRepository = priceHistoryRepository;
        this.assetRepository = assetRepository;
    }

    // This is the method you're trying to call
    public void generatePriceHistory() {
        // Get all assets in the database
        List<Asset> assets = assetRepository.findAll();

        // Loop through each asset and save 365 price history entries
        for (Asset asset : assets) {
            List<LocalDate> last365Days = SchedulerConfig.getLast365Days(); // Getting last 365 days

            for (LocalDate date : last365Days) {
                // Here we use a random price for simplicity, you can replace this with real data
                double randomPrice = generateRandomPrice(asset);

                // Creating a new PriceHistory entry for each asset and date
                PriceHistory priceHistory = new PriceHistory();
                priceHistory.setAsset(asset);
                priceHistory.setPrice(randomPrice);
                priceHistory.setDate(date);

                // Saving the PriceHistory entry to the database
                priceHistoryRepository.save(priceHistory);
            }
        }
    }

    private double generateRandomPrice(Asset asset) {
        // Example: create random price (you could implement real pricing logic here)
        Random random = new Random();
        return asset.getCurrentPrice() + (random.nextDouble() * 10); // Adding up to 10 for randomness
    }
}
