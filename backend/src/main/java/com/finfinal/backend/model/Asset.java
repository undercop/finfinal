package com.finfinal.backend.model;
import com.finfinal.backend.enums.AssetCategory;

import jakarta.persistence.*;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private AssetCategory category;

    private double currentPrice;
    private double lastDayPrice;
    private int quantity;

    public Asset() {}

    public Asset(Long id, String name, AssetCategory category, double currentPrice, double lastDayPrice, int quantity) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.currentPrice = currentPrice;
        this.lastDayPrice = lastDayPrice;
        this.quantity = quantity;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AssetCategory getCategory() { return category; }
    public void setCategory(AssetCategory category) { this.category = category; }

    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }

    public double getLastDayPrice() { return lastDayPrice; }
    public void setLastDayPrice(double lastDayPrice) { this.lastDayPrice = lastDayPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
