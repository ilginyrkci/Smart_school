package com.finans.controller;

import com.finans.model.User;
import com.finans.service.AuthService;
import com.finans.service.CoachService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coach")
@CrossOrigin(origins = "*")
public class CoachController {

    private final CoachService service;
    private final AuthService authService;

    public CoachController(CoachService service, AuthService authService) {
        this.service     = service;
        this.authService = authService;
    }

    @GetMapping("/advice")
    public ResponseEntity<?> getAdvice(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            User user = authService.validateAndGetUser(auth);
            return ResponseEntity.ok(service.generateReport(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
