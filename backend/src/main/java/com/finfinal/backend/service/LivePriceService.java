package com.finfinal.backend.service;

import com.finfinal.backend.DTO.LivePriceDto;
import com.finfinal.backend.model.LivePrice;
import com.finfinal.backend.repository.LivePriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivePriceService {

    private final LivePriceRepository repository;

    public LivePriceService(LivePriceRepository repository) {
        this.repository = repository;
    }

    public List<LivePriceDto> getAllLivePrices() {
        return repository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LivePriceDto getLivePriceForAsset(Long assetId) {
        LivePrice price = repository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Live price not found"));
        return toDto(price);
    }

    private LivePriceDto toDto(LivePrice live) {
        return new LivePriceDto(
                live.getAssetId(),
                live.getPrice(),
                live.getUpdatedAt()
        );
    }
}