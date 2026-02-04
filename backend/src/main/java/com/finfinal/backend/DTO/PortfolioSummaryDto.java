package com.finfinal.backend.DTO;

public class PortfolioSummaryDto {

    private double totalPortfolioValue;
    private double oneDayReturn;
    private double oneDayReturnValue;
    private double projectedValue;

    // getters & setters
    public double getTotalPortfolioValue() {
        return totalPortfolioValue;
    }

    public void setTotalPortfolioValue(double totalPortfolioValue) {
        this.totalPortfolioValue = totalPortfolioValue;
    }

    public double getOneDayReturn() {
        return oneDayReturn;
    }

    public void setOneDayReturn(double oneDayReturn) {
        this.oneDayReturn = oneDayReturn;
    }

    public double getOneDayReturnValue() {
        return oneDayReturnValue;
    }

    public void setOneDayReturnValue(double oneDayReturnValue) {
        this.oneDayReturnValue = oneDayReturnValue;
    }

    public double getProjectedValue() {
        return projectedValue;
    }

    public void setProjectedValue(double projectedValue) {
        this.projectedValue = projectedValue;
    }
}
