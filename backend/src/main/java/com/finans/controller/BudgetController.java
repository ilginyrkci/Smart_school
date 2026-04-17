package com.finans.controller;

import com.finans.model.User;
import com.finans.service.AuthService;
import com.finans.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService service;
    private final AuthService authService;

    public BudgetController(BudgetService service, AuthService authService) {
        this.service     = service;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getBudget(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            User user = authService.validateAndGetUser(auth);
            return ResponseEntity.ok(service.getBudgetSummary(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateBudget(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> body) {
        try {
            User user = authService.validateAndGetUser(auth);
            Double newLimit = Double.parseDouble(body.get("monthlyLimit").toString());
            return ResponseEntity.ok(service.updateLimit(user.getId(), newLimit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
