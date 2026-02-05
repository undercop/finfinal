package com.finfinal.backend.repository;

import com.finfinal.backend.model.IntradayPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface IntradayPriceRepository extends JpaRepository<IntradayPrice, Long> {

    List<IntradayPrice> findByAssetIdOrderByTimestampAsc(Long assetId);

    void deleteByTimestampBefore(LocalDateTime time);
}
