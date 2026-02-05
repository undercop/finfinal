package com.finfinal.backend.service;

import com.finfinal.backend.DTO.RebalancingSuggestion;
import com.finfinal.backend.DTO.RiskAssessmentDto;
import com.finfinal.backend.config.AiPromptBuilder;
import org.springframework.stereotype.Service;
import  com.finfinal.backend.ai.GeminiClient;

import java.util.List;

@Service
public class AiRebalancingService {

    private final GeminiClient client; // or mocked
    private final AiPromptBuilder promptBuilder;
    private final RebalancingEngine engine;
    private final AdvancedRiskAssessmentService riskService;

    public AiRebalancingService(
            com.finfinal.backend.ai.GeminiClient client,
            AiPromptBuilder promptBuilder,
            RebalancingEngine engine,
            AdvancedRiskAssessmentService riskService
    ) {
        this.client = client;
        this.promptBuilder = promptBuilder;
        this.engine = engine;
        this.riskService = riskService;
    }

    public String getQuarterlyAdvice() {

        RiskAssessmentDto risk = riskService.assess();
        List<RebalancingSuggestion> rules =
                engine.generate(risk.getCategoryExposure(), risk.getRiskLabel());

        String prompt = promptBuilder.buildRebalancingPrompt(risk, rules);

        return client.ask(prompt);
    }
}

