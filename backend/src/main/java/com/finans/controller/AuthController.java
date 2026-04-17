package com.finans.controller;

import com.finans.model.User;
import com.finans.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController - Kimlik doğrulama REST API
 * POST /api/auth/register  → Kayıt ol
 * POST /api/auth/login     → Giriş yap
 * GET  /api/auth/me        → Profil bilgisi
 * PUT  /api/auth/profile   → Profil güncelle
 * PUT  /api/auth/password  → Şifre değiştir
 * POST /api/auth/logout    → Çıkış yap
 * PUT  /api/auth/username  → Kullanıcı adı değiştir
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ─── Kayıt ────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.status(201).body(authService.register(
                    body.getOrDefault("username", "").toString(),
                    body.getOrDefault("password", "").toString(),
                    body.getOrDefault("displayName", "").toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Giriş ────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.ok(authService.login(
                    body.getOrDefault("username", "").toString(),
                    body.getOrDefault("password", "").toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Profil Bilgisi ───────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            return ResponseEntity.ok(authService.validateAndGetUser(auth).toPublicMap());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Profil Güncelle ──────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> body) {
        User user;
        try { user = authService.validateAndGetUser(auth); }
        catch (Exception e) { return ResponseEntity.status(401).body(Map.of("error", e.getMessage())); }
        try { return ResponseEntity.ok(authService.updateProfile(user, body)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    // ─── Şifre Değiştir ───────────────────────────────────
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> body) {
        User user;
        try { user = authService.validateAndGetUser(auth); }
        catch (Exception e) { return ResponseEntity.status(401).body(Map.of("error", e.getMessage())); }
        try {
            authService.changePassword(user,
                    body.getOrDefault("oldPassword", "").toString(),
                    body.getOrDefault("newPassword", "").toString());
            return ResponseEntity.ok(Map.of("success", true, "message", "Şifre başarıyla değiştirildi."));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    // ─── Çıkış ────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        try { authService.logout(authService.validateAndGetUser(auth)); } catch (Exception ignored) {}
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ─── Kullanıcı Adı Değiştir ───────────────────────────
    @PutMapping("/username")
    public ResponseEntity<?> changeUsername(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> body) {
        User user;
        try { user = authService.validateAndGetUser(auth); }
        catch (Exception e) { return ResponseEntity.status(401).body(Map.of("error", e.getMessage())); }
        try {
            return ResponseEntity.ok(
                    authService.changeUsername(user, body.getOrDefault("newUsername", "").toString())
            );
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }
}
