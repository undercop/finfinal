package com.finfinal.backend.repository;

import com.finfinal.backend.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Optional<Holding> findByAssetId(Long assetId);
}
