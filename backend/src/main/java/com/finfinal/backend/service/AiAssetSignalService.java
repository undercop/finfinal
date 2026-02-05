package com.finfinal.backend.service;

import com.finfinal.backend.DTO.AssetSignal;
import com.finfinal.backend.DTO.RiskAssessmentDto;
import com.finfinal.backend.ai.GeminiClient;
import com.finfinal.backend.config.AiPromptBuilder;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

@Service
public class AiAssetSignalService {

    private final GeminiClient client;
    private final AiPromptBuilder promptBuilder;
    private final AssetSignalEngine engine;
    private final AdvancedRiskAssessmentService riskService;
    private final AssetRepository assetRepo;

    public AiAssetSignalService(
            GeminiClient client,
            AiPromptBuilder promptBuilder,
            AssetSignalEngine engine,
            AdvancedRiskAssessmentService riskService,
            AssetRepository assetRepo
    ) {
        this.client = client;
        this.promptBuilder = promptBuilder;
        this.engine = engine;
        this.riskService = riskService;
        this.assetRepo = assetRepo;
    }

    public String getSignalForAsset(Long assetId) {

        Asset asset = assetRepo.findById(assetId)
                .orElseThrow();

        RiskAssessmentDto risk = riskService.assess();

        double totalValue = assetRepo.findAll().stream()
                .mapToDouble(a -> a.getCurrentPrice() * a.getQuantity())
                .sum();

        double assetValue = asset.getCurrentPrice() * asset.getQuantity();
        double allocation = (assetValue / totalValue) * 100;

        AssetSignal signal =
                engine.evaluate(asset, allocation, risk.getRiskLabel());

        String prompt =
                promptBuilder.buildAssetSignalPrompt(signal);

        return client.ask(prompt);
    }
}

