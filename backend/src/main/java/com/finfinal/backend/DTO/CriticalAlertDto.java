package com.finfinal.backend.DTO;

public class CriticalAlertDto {

    private Long assetId;
    private String assetName;
    private String category;
    private String message;
    private double changePercent;
    private String severity; // WARNING / OPPORTUNITY

    public CriticalAlertDto(
            Long assetId,
            String assetName,
            String category,
            String message,
            double changePercent,
            String severity
    ) {
        this.assetId = assetId;
        this.assetName = assetName;
        this.category = category;
        this.message = message;
        this.changePercent = changePercent;
        this.severity = severity;
    }

    public Long getAssetId() {
        return assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public String getCategory() {
        return category;
    }

    public String getMessage() {
        return message;
    }

    public double getChangePercent() {
        return changePercent;
    }

    public String getSeverity() {
        return severity;
    }
}
