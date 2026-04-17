package com.finans.controller;

import com.finans.model.Transaction;
import com.finans.model.User;
import com.finans.service.AuthService;
import com.finans.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService service;
    private final AuthService authService;

    public TransactionController(TransactionService service, AuthService authService) {
        this.service     = service;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam(required = false) String type) {
        try {
            User user = authService.validateAndGetUser(auth);
            List<Transaction> txs = switch (type != null ? type : "all") {
                case "income"  -> service.getIncomes(user.getId());
                case "expense" -> service.getExpenses(user.getId());
                default        -> service.getAllTransactions(user.getId());
            };
            return ResponseEntity.ok(txs);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> body) {
        try {
            User user = authService.validateAndGetUser(auth);
            Transaction created = service.createTransaction(body, user.getId());
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            User user = authService.validateAndGetUser(auth);
            Transaction updated = service.updateTransaction(id, body, user.getId());
            if (updated == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable Long id) {
        try {
            User user = authService.validateAndGetUser(auth);
            boolean deleted = service.deleteTransaction(id, user.getId());
            if (!deleted) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("success", true, "message", "İşlem silindi"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
