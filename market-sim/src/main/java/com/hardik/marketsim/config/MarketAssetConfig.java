package com.hardik.marketsim.config;

import com.hardik.marketsim.model.AssetCategory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "market")
public class MarketAssetConfig {

    private List<AssetConfig> assets = new ArrayList<>();

    public List<AssetConfig> getAssets() {
        return assets;
    }

    public void setAssets(List<AssetConfig> assets) {
        this.assets = assets;
    }

    public static class AssetConfig {
        private Long id;
        private AssetCategory category;
        private double basePrice;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public AssetCategory getCategory() {
            return category;
        }

        public void setCategory(AssetCategory category) {
            this.category = category;
        }

        public double getBasePrice() {
            return basePrice;
        }

        public void setBasePrice(double basePrice) {
            this.basePrice = basePrice;
        }
    }
}