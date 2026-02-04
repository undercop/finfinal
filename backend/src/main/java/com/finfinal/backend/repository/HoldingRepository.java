package com.finfinal.backend.repository;

import com.finfinal.backend.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {
    // Find holding by the linked Asset's ID
    Optional<Holding> findByAssetId(Long assetId);
}