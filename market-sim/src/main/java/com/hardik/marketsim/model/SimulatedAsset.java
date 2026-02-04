package com.hardik.marketsim.model;

public class SimulatedAsset {

    private Long assetId;              // must match backend asset ID
    private AssetCategory category;
    private double price;

    public SimulatedAsset(Long assetId, AssetCategory category, double price) {
        this.assetId = assetId;
        this.category = category;
        this.price = price;
    }

    public Long getAssetId() {
        return assetId;
    }

    public AssetCategory getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}