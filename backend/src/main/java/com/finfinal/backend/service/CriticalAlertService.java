package com.finfinal.backend.service;

import com.finfinal.backend.DTO.CriticalAlertDto;
import com.finfinal.backend.config.AlertThresholdConfig;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CriticalAlertService {

    private final AssetRepository assetRepository;
    private final AlertThresholdConfig thresholdConfig;

    public CriticalAlertService(
            AssetRepository assetRepository,
            AlertThresholdConfig thresholdConfig
    ) {
        this.assetRepository = assetRepository;
        this.thresholdConfig = thresholdConfig;
    }

    public List<CriticalAlertDto> getCriticalAlerts() {

        List<CriticalAlertDto> alerts = new ArrayList<>();

        for (Asset asset : assetRepository.findAll()) {

            if (asset.getLastDayPrice() <= 0) continue;

            double changePercent =
                    ((asset.getCurrentPrice() - asset.getLastDayPrice())
                            / asset.getLastDayPrice()) * 100;

            double dropLimit = thresholdConfig.getDropThreshold(asset.getCategory());
            double riseLimit = thresholdConfig.getRiseThreshold(asset.getCategory());

            if (changePercent <= dropLimit) {
                alerts.add(new CriticalAlertDto(
                        asset.getId(),
                        asset.getName(),
                        asset.getCategory().name(),
                        "Sharp decline detected. Consider reviewing or reducing exposure.",
                        changePercent,
                        "WARNING"
                ));
            }

            if (changePercent >= riseLimit) {
                alerts.add(new CriticalAlertDto(
                        asset.getId(),
                        asset.getName(),
                        asset.getCategory().name(),
                        "Strong rally observed. Booking partial profits may reduce risk.",
                        changePercent,
                        "OPPORTUNITY"
                ));
            }
        }

        return alerts;
    }
}
