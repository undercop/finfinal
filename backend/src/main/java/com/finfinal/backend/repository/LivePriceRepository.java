package com.finfinal.backend.repository;

import com.finfinal.backend.model.LivePrice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivePriceRepository extends JpaRepository<LivePrice, Long> {
}
