package com.finfinal.backend.service;

import com.finfinal.backend.DTO.HoldingDto;
import com.finfinal.backend.model.Holding;
import com.finfinal.backend.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HoldingService {

    private final HoldingRepository holdingRepository;

    public HoldingService(HoldingRepository holdingRepository) {
        this.holdingRepository = holdingRepository;
    }

    public List<HoldingDto> getAllHoldings() {
        List<Holding> holdings = holdingRepository.findAll();

        return holdings.stream()
                // Only show holdings where you actually own something (quantity > 0)
                .filter(h -> h.getQuantity() > 0)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private HoldingDto convertToDto(Holding holding) {
        double currentPrice = holding.getAsset().getCurrentPrice();
        double avgBuyPrice = holding.getAvgBuyPrice();
        int quantity = holding.getQuantity();

        // LOGIC: Profit = (Current Price - Buy Price) * Quantity
        double profit = (currentPrice - avgBuyPrice) * quantity;

        return new HoldingDto(
                holding.getAsset().getId(),
                holding.getAsset().getName(),
                quantity,
                round(avgBuyPrice),
                currentPrice,
                round(profit)
        );
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}