package com.finfinal.backend.DTO;

import com.finfinal.backend.enums.TransactionType;
import java.time.format.DateTimeFormatter;

public class TransactionResponseDto {
    private Long id;
    private TransactionType type;
    private double price;
    private int quantity;
    private String date;
    private AssetSummaryDto asset;


    public static class AssetSummaryDto {
        private Long id;
        private String name;

        public AssetSummaryDto(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
    }


    public TransactionResponseDto(Long id, TransactionType type, double price, int quantity, java.time.LocalDateTime timestamp, Long assetId, String assetName) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.quantity = quantity;


        if (timestamp != null) {
            this.date = timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        } else {
            this.date = "N/A";
        }

        this.asset = new AssetSummaryDto(assetId, assetName);
    }


    public Long getId() { return id; }
    public TransactionType getType() { return type; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getDate() { return date; }
    public AssetSummaryDto getAsset() { return asset; }
}
