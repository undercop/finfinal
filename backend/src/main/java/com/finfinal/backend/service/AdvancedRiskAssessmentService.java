package com.finfinal.backend.service;

import com.finfinal.backend.DTO.RiskAssessmentDto;
import com.finfinal.backend.enums.AssetCategory;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdvancedRiskAssessmentService {

    private final AssetRepository assetRepository;

    public AdvancedRiskAssessmentService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public RiskAssessmentDto assess() {

        List<Asset> assets = assetRepository.findAll();

        double totalValue = assets.stream()
                .mapToDouble(a -> a.getCurrentPrice() * a.getQuantity())
                .sum();

        Map<AssetCategory, Double> exposure = new EnumMap<>(AssetCategory.class);

        for (Asset a : assets) {
            double value = a.getCurrentPrice() * a.getQuantity();
            exposure.merge(a.getCategory(), value, Double::sum);
        }

        Map<String, Double> percent = new HashMap<>();
        exposure.forEach((k, v) ->
                percent.put(k.name(), round(v / totalValue * 100)));

        double score = 0;
        Map<String, Double> dimensionScores = new HashMap<>();
        List<String> insights = new ArrayList<>();

        // A. Allocation risk
        double allocationRisk = exposure.entrySet().stream()
                .mapToDouble(e -> (e.getValue() / totalValue) * riskWeight(e.getKey()))
                .sum();

        score += allocationRisk;
        dimensionScores.put("allocationRisk", round(allocationRisk));

        // B. Concentration risk
        double concentrationRisk = 0;
        for (var e : percent.entrySet()) {
            if (isOverConcentrated(e.getKey(), e.getValue())) {
                concentrationRisk += 0.3;
                insights.add("High concentration in " + e.getKey() +
                        " may increase volatility during market cycles.");
            }
        }
        score += concentrationRisk;
        dimensionScores.put("concentrationRisk", concentrationRisk);

        // C. Growth bias
        double growthExposure =
                percent.getOrDefault("STOCK", 0.0)
                        + percent.getOrDefault("MF_SMALL", 0.0)
                        + percent.getOrDefault("MF_MID", 0.0);

        if (growthExposure > 60) {
            score += 0.4;
            insights.add("Portfolio has strong growth bias which can amplify long-term returns but increases drawdown risk.");
            dimensionScores.put("growthBiasRisk", 0.4);
        }

        // D. Defensive coverage
        double defensive =
                percent.getOrDefault("GOLD_ETF", 0.0)
                        + percent.getOrDefault("MF_LARGE", 0.0);

        if (defensive < 15) {
            score += 0.3;
            insights.add("Low defensive allocation reduces downside protection during prolonged market corrections.");
            dimensionScores.put("defensiveRisk", 0.3);
        }

        // E. Diversification breadth
        long activeCategories = percent.values().stream().filter(v -> v > 1).count();
        if (activeCategories <= 3) {
            score += 0.25;
            insights.add("Limited diversification across asset classes increases dependency on specific market segments.");
            dimensionScores.put("diversificationRisk", 0.25);
        }

        RiskAssessmentDto dto = new RiskAssessmentDto();
        dto.setRiskScore(round(score));
        dto.setRiskLabel(label(score));
        dto.setCategoryExposure(percent);
        dto.setDimensionScores(dimensionScores);
        dto.setInsights(insights);
        dto.setSummary(generateSummary(score, growthExposure, defensive));

        return dto;
    }

    private int riskWeight(AssetCategory c) {
        return switch (c) {
            case GOLD_ETF -> 1;
            case MF_LARGE, SILVER_ETF -> 2;
            case MF_MID -> 3;
            case MF_SMALL, STOCK -> 4;
        };
    }

    private boolean isOverConcentrated(String cat, double pct) {
        return (cat.equals("STOCK") && pct > 35)
                || (cat.equals("MF_SMALL") && pct > 25)
                || (cat.equals("MF_MID") && pct > 30)
                || (cat.equals("MF_LARGE") && pct > 45);
    }

    private String label(double s) {
        if (s < 2) return "Conservative";
        if (s < 2.7) return "Moderate";
        if (s < 3.4) return "Moderate-High";
        return "Aggressive";
    }

    private String generateSummary(double score, double growth, double defensive) {
        if (score > 3.3)
            return "Aggressive long-term portfolio with high growth orientation and elevated volatility.";
        if (growth > 55)
            return "Growth-oriented portfolio suitable for long-term wealth creation with periodic drawdowns.";
        if (defensive > 35)
            return "Balanced portfolio with strong downside protection and steady compounding focus.";
        return "Moderately balanced portfolio aligned with long-term investment objectives.";
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}