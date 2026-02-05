package com.finfinal.backend.DTO;

import java.util.List;
import java.util.Map;

public class RiskAssessmentDto {

    private double riskScore;
    private String riskLabel;

    private Map<String, Double> categoryExposure;
    private Map<String, Double> dimensionScores;

    private List<String> insights;
    private String summary;

    public double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(double riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLabel() {
        return riskLabel;
    }

    public void setRiskLabel(String riskLabel) {
        this.riskLabel = riskLabel;
    }

    public Map<String, Double> getCategoryExposure() {
        return categoryExposure;
    }

    public void setCategoryExposure(Map<String, Double> categoryExposure) {
        this.categoryExposure = categoryExposure;
    }

    public Map<String, Double> getDimensionScores() {
        return dimensionScores;
    }

    public void setDimensionScores(Map<String, Double> dimensionScores) {
        this.dimensionScores = dimensionScores;
    }

    public List<String> getInsights() {
        return insights;
    }

    public void setInsights(List<String> insights) {
        this.insights = insights;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
