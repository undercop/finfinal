//package com.finfinal.backend.model;
//
//import com.finfinal.backend.enums.TransactionType;
//import jakarta.persistence.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "transactions")
//public class Transaction {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    private Asset asset;
//
//    @Enumerated(EnumType.STRING)
//    private TransactionType type;
//
//    private double price;
//    private int quantity;
//    private LocalDateTime timestamp;
//
//    // Getters and setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public Asset getAsset() { return asset; }
//    public void setAsset(Asset asset) { this.asset = asset; }
//
//    public TransactionType getType() { return type; }
//    public void setType(TransactionType type) { this.type = type; }
//
//    public double getPrice() { return price; }
//    public void setPrice(double price) { this.price = price; }
//
//    public int getQuantity() { return quantity; }
//    public void setQuantity(int quantity) { this.quantity = quantity; }
//
//    public LocalDateTime getTimestamp() { return timestamp; }
//    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
//}
//
//
package com.finfinal.backend.model;

import com.finfinal.backend.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions") // Matches your DB table name
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Matches 'asset_id' column in DB
    // We use @ManyToOne so we can access asset.getName() easily
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    @JsonIgnoreProperties({"transactions", "hibernateLazyInitializer", "handler"}) // Prevents infinite loops
    private Asset asset;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private double price;
    private int quantity;

    private LocalDateTime timestamp;

    // Constructors
    public Transaction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}