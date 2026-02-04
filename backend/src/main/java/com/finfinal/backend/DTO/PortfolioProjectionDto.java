package com.finfinal.backend.DTO;


public class PortfolioProjectionDto {

    private int years;
    private double currentValue;
    private double projectedValue;

    public PortfolioProjectionDto(int years, double currentValue, double projectedValue) {
        this.years = years;
        this.currentValue = currentValue;
        this.projectedValue = projectedValue;
    }

    public int getYears() {
        return years;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public double getProjectedValue() {
        return projectedValue;
    }
}
