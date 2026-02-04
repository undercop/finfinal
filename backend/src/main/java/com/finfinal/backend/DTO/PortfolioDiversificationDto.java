package com.finfinal.backend.DTO;



public class PortfolioDiversificationDto {

    private String category;
    private double value;

    public PortfolioDiversificationDto(String category, double value) {
        this.category = category;
        this.value = value;
    }

    public String getCategory() {
        return category;
    }

    public double getValue() {
        return value;
    }
}

