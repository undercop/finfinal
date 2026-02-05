package com.finfinal.backend.service;

import com.finfinal.backend.DTO.RebalancingSuggestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RebalancingEngine {

    public List<RebalancingSuggestion> generate(
            Map<String, Double> exposure,
            String riskLabel
    ) {

        Map<String, Double> ideal = idealAllocation(riskLabel);
        List<RebalancingSuggestion> list = new ArrayList<>();

        for (String category : ideal.keySet()) {

            double current = exposure.getOrDefault(category, 0.0);
            double target = ideal.get(category);
            double diff = current - target;

            RebalancingSuggestion rs = new RebalancingSuggestion();
            rs.setCategory(category);
            rs.setCurrentPercent(round(current));
            rs.setTargetPercent(target);

            if (Math.abs(diff) < 5) {
                rs.setAction("HOLD");
            } else if (diff > 0) {
                rs.setAction("DECREASE");
            } else {
                rs.setAction("INCREASE");
            }

            list.add(rs);
        }
        return list;
    }

    private Map<String, Double> idealAllocation(String risk) {

        return switch (risk) {
            case "Conservative" -> Map.of(
                    "MF_LARGE", 45.0,
                    "GOLD_ETF", 20.0,
                    "MF_MID", 15.0,
                    "MF_SMALL", 10.0,
                    "STOCK", 10.0
            );

            case "Moderate" -> Map.of(
                    "MF_LARGE", 35.0,
                    "MF_MID", 20.0,
                    "MF_SMALL", 15.0,
                    "STOCK", 20.0,
                    "GOLD_ETF", 10.0
            );

            default -> Map.of(
                    "STOCK", 35.0,
                    "MF_SMALL", 25.0,
                    "MF_MID", 20.0,
                    "MF_LARGE", 15.0,
                    "GOLD_ETF", 5.0
            );
        };
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}

