package com.finfinal.backend.config;

import com.finfinal.backend.DTO.RebalancingSuggestion;
import com.finfinal.backend.DTO.RiskAssessmentDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AiPromptBuilder {

    public String buildRebalancingPrompt(
            RiskAssessmentDto risk,
            List<RebalancingSuggestion> suggestions
    ) {

        StringBuilder sb = new StringBuilder();

        sb.append("""
        You are a long-term investment advisor.
        The goal is portfolio stability and gradual wealth creation.
        This is a quarterly review, not short-term trading.

        Risk profile:
        Score: """).append(risk.getRiskScore()).append("""
        Label: """).append(risk.getRiskLabel()).append("""

        Category exposure:
        """);

        risk.getCategoryExposure()
                .forEach((k, v) -> sb.append("- ").append(k)
                        .append(": ").append(v).append("%\n"));

        sb.append("\nRebalancing analysis:\n");

        for (RebalancingSuggestion s : suggestions) {
            sb.append("- ").append(s.getCategory())
                    .append(": ").append(s.getAction())
                    .append(" (current ")
                    .append(s.getCurrentPercent())
                    .append("% → target ")
                    .append(s.getTargetPercent())
                    .append("%)\n");
        }

        sb.append("""
        Provide a detailed quarterly rebalancing explanation with:
        - 5 to 7 bullet points
        - Each bullet should be 1–2 lines long
        - Explain why each suggested change improves long-term portfolio stability
        - Avoid short answers
        - Avoid disclaimers or generic cautions
        - Avoid mentioning AI, models, or data sources
        
        Focus strictly on long-term investing discipline,
        gradual rebalancing, and risk-adjusted wealth creation.
        """);

        return sb.toString();
    }
}
