package com.finfinal.backend.repository;

import com.finfinal.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Fetch all, ordered by newest first
    List<Transaction> findAllByOrderByTimestampDesc();
}