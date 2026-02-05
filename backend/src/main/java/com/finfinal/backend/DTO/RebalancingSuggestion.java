package com.finfinal.backend.DTO;

public class RebalancingSuggestion {

    private String category;
    private double currentPercent;
    private double targetPercent;
    private String action; // INCREASE / DECREASE / HOLD

    // getters & setters

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getCurrentPercent() {
        return currentPercent;
    }

    public void setCurrentPercent(double currentPercent) {
        this.currentPercent = currentPercent;
    }

    public double getTargetPercent() {
        return targetPercent;
    }

    public void setTargetPercent(double targetPercent) {
        this.targetPercent = targetPercent;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}

