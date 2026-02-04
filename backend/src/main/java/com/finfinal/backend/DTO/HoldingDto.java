package com.finfinal.backend.DTO;

public class HoldingDto {
    private Long assetId;
    private String assetName;
    private int quantity;
    private double avgBuyPrice;
    private double currentPrice;
    private double profit; // Calculated field

    // Constructor
    public HoldingDto(Long assetId, String assetName, int quantity, double avgBuyPrice, double currentPrice, double profit) {
        this.assetId = assetId;
        this.assetName = assetName;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
        this.currentPrice = currentPrice;
        this.profit = profit;
    }

    // Getters
    public Long getAssetId() { return assetId; }
    public String getAssetName() { return assetName; }
    public int getQuantity() { return quantity; }
    public double getAvgBuyPrice() { return avgBuyPrice; }
    public double getCurrentPrice() { return currentPrice; }
    public double getProfit() { return profit; }
}