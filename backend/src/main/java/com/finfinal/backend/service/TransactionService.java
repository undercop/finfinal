package com.finfinal.backend.service;

import com.finfinal.backend.DTO.TransactionDto;
import com.finfinal.backend.enums.TransactionType;
import com.finfinal.backend.model.Asset;
import com.finfinal.backend.model.Holding;
import com.finfinal.backend.model.Transaction;
import com.finfinal.backend.repository.AssetRepository;
import com.finfinal.backend.repository.HoldingRepository;
import com.finfinal.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AssetRepository assetRepository;
    private final HoldingRepository holdingRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              AssetRepository assetRepository,
                              HoldingRepository holdingRepository) {
        this.transactionRepository = transactionRepository;
        this.assetRepository = assetRepository;
        this.holdingRepository = holdingRepository;
    }

    @Transactional
    public Transaction create(TransactionDto dto) {

        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Holding holding = holdingRepository
                .findByAssetId(asset.getId())
                .orElse(null);

        if (dto.getType() == TransactionType.BUY) {
            handleBuy(asset, holding, dto);
        } else {
            handleSell(asset, holding, dto);
        }

        Transaction tx = new Transaction();
        tx.setAsset(asset);
        tx.setType(dto.getType());
        tx.setPrice(dto.getPrice());
        tx.setQuantity(dto.getQuantity());
        tx.setTimestamp(LocalDateTime.now());

        return transactionRepository.save(tx);
    }

    private void handleBuy(Asset asset, Holding holding, TransactionDto dto) {

        if (holding == null) {
            holding = new Holding();
            holding.setAsset(asset);
            holding.setQuantity(0);
            holding.setAvgBuyPrice(0);
        }

        double totalCost =
                holding.getQuantity() * holding.getAvgBuyPrice()
                        + dto.getQuantity() * dto.getPrice();

        int newQuantity = holding.getQuantity() + dto.getQuantity();
        double newAvgPrice = totalCost / newQuantity;

        holding.setQuantity(newQuantity);
        holding.setAvgBuyPrice(round(newAvgPrice));

        asset.setQuantity(asset.getQuantity() + dto.getQuantity());

        holdingRepository.save(holding);
        assetRepository.save(asset);
    }

    private void handleSell(Asset asset, Holding holding, TransactionDto dto) {

        if (holding == null || holding.getQuantity() < dto.getQuantity()) {
            throw new RuntimeException("Insufficient quantity to sell");
        }

        holding.setQuantity(holding.getQuantity() - dto.getQuantity());
        asset.setQuantity(asset.getQuantity() - dto.getQuantity());

        holdingRepository.save(holding);
        assetRepository.save(asset);
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
