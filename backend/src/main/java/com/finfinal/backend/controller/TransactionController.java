package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.TransactionDto;
import com.finfinal.backend.model.Transaction;
import com.finfinal.backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create a new Transaction (BUY / SELL)
    @PostMapping
    public Transaction create(@RequestBody TransactionDto dto) {
        return transactionService.create(dto);
    }
}
