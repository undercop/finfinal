package com.finfinal.backend.DTO;

import java.time.LocalDate;

public class PriceHistoryDto {
    private LocalDate date;
    private double price;

    public PriceHistoryDto(LocalDate date, double price) {
        this.date = date;
        this.price = price;
    }

    public LocalDate getDate() { return date; }
    public double getPrice() { return price; }
}