package com.finfinal.backend.repository;

import com.finfinal.backend.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    // last N days for asset, ordered
    List<PriceHistory> findTop30ByAssetIdOrderByDateDesc(Long assetId);

    List<PriceHistory> findTop2ByAssetIdOrderByDateDesc(Long assetId);
}
