package com.finfinal.backend.repository;

import com.finfinal.backend.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    // ✅ NEW: Fetch all history for an asset, ordered oldest -> newest
    // Since your entity has "private Asset asset", we use "AssetId" in the method name
    List<PriceHistory> findByAssetIdOrderByDateAsc(Long assetId);

    // ... keep your existing methods ...
    List<PriceHistory> findTop30ByAssetIdOrderByDateDesc(Long assetId);
    List<PriceHistory> findTop2ByAssetIdOrderByDateDesc(Long assetId);
}