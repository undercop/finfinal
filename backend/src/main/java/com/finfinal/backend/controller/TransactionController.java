package com.finfinal.backend.controller;

import com.finfinal.backend.DTO.TransactionDto;
import com.finfinal.backend.DTO.TransactionResponseDto; // Import the new DTO
import com.finfinal.backend.model.Transaction;
import com.finfinal.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ✅ NEW: GET endpoint for the table
    @GetMapping
    public ResponseEntity<List<TransactionResponseDto>> getAllTransactions() {
        List<TransactionResponseDto> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // ... your existing POST create method ...
    @PostMapping
    public Transaction create(@RequestBody TransactionDto dto) {
        return transactionService.create(dto);
    }
}