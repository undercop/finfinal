package com.finfinal.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;


@Entity
@Table(name = "live_prices" )
public class LivePrice {
    @Id
    private Long AssetId;
    private double price;
    private LocalDateTime updatedAt;

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getAssetId() {
        return AssetId;
    }

    public void setAssetId(Long assetId) {
        AssetId = assetId;
    }
}
