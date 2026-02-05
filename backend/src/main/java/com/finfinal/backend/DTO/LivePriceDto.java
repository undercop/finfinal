package com.finfinal.backend.DTO;

import java.time.LocalDateTime;

public class LivePriceDto {

    private Long assetId;
    private double price;
    private LocalDateTime updatedAt;

    public LivePriceDto(Long assetId, double price, LocalDateTime updatedAt) {
        this.assetId = assetId;
        this.price = price;
        this.updatedAt = updatedAt;
    }

    public Long getAssetId() {
        return assetId;
    }

    public double getPrice() {
        return price;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}