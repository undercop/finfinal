package com.hardik.marketsim.model;

public class SimulatedAsset {

    private Long id;              // must match backend asset ID
    private AssetCategory category;
    private double price;

    public SimulatedAsset(Long assetId, AssetCategory category, double price) {
        this.id = assetId;
        this.category = category;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCategory(AssetCategory category) {
        this.category = category;
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