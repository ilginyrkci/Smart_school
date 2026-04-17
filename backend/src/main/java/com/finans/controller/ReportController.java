package com.finans.controller;

import com.finans.model.User;
import com.finans.service.AuthService;
import com.finans.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService service;
    private final AuthService authService;

    public ReportController(ReportService service, AuthService authService) {
        this.service     = service;
        this.authService = authService;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            User user = authService.validateAndGetUser(auth);
            return ResponseEntity.ok(service.getSummary(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            User user = authService.validateAndGetUser(auth);
            return ResponseEntity.ok(service.getCategoryBreakdown(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<?> getMonthlyTrend(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            User user = authService.validateAndGetUser(auth);
            return ResponseEntity.ok(service.getMonthlyTrend(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
