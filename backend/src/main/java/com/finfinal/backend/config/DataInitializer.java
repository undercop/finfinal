package com.finfinal.backend.config;


import com.finfinal.backend.model.Asset;
import com.finfinal.backend.repository.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.finfinal.backend.enums.AssetCategory.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AssetRepository assetRepository;

    public DataInitializer(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public void run(String... args) {

        // Hardik: To Prevent duplicate inserts
        if (assetRepository.count() > 0) return;

        assetRepository.saveAll(List.of(

                // STOCKS
                new Asset(null, "Reliance Industries", STOCK, 2890.50, 2855.30, 8),
                new Asset(null, "TCS", STOCK, 4120.75, 4080.20, 6),
                new Asset(null, "Infosys", STOCK, 1645.10, 1622.40, 10),
                new Asset(null, "HDFC Bank", STOCK, 1520.40, 1495.60, 12),

                // MF LARGE
                new Asset(null, "Nifty 50 Index Fund", MF_LARGE, 182.40, 181.10, 120),
                new Asset(null, "ICICI Bluechip Fund", MF_LARGE, 735.60, 729.30, 20),
                new Asset(null, "HDFC Top 100 Fund", MF_LARGE, 812.20, 805.90, 15),
                new Asset(null, "UTI Nifty Index Fund", MF_LARGE, 164.80, 163.10, 140),

                // MF MID
                new Asset(null, "Axis Midcap Fund", MF_MID, 541.80, 538.60, 18),
                new Asset(null, "Kotak Emerging Equity", MF_MID, 612.45, 607.90, 14),
                new Asset(null, "PGIM Midcap Fund", MF_MID, 489.30, 486.10, 22),

                // MF SMALL
                new Asset(null, "SBI Small Cap Fund", MF_SMALL, 186.75, 182.40, 30),
                new Asset(null, "Nippon Small Cap Fund", MF_SMALL, 152.60, 149.90, 35),
                new Asset(null, "Axis Small Cap Fund", MF_SMALL, 164.20, 161.80, 25),

                // GOLD ETF
                new Asset(null, "SBI Gold ETF", GOLD_ETF, 349.00, 335.00, 8),

                // SILVER ETF
                new Asset(null, "ICICI Silver ETF", SILVER_ETF, 515.00, 490.00, 1)
        ));
    }
}
