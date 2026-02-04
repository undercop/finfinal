package com.finfinal.backend.DTO;

public class SimulatedPriceDto {
    private Long id;
    private double price;

    public void setId(Long id) {
        this.id = id;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public double getPrice() {
        return price;
    }
}
