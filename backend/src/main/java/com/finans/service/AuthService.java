package com.finans.service;

import com.finans.model.User;
import com.finans.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * AuthService - Kullanıcı kimlik doğrulama iş mantığı.
 * Kayıt, giriş, token doğrulama ve profil güncelleme.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ----- Şifre Hashleme (SHA-256) -----
    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Şifre hashleme hatası", e);
        }
    }

    // ----- Kayıt -----
    public Map<String, Object> register(String username, String password, String displayName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor.");
        }
        if (username.length() < 3) {
            throw new RuntimeException("Kullanıcı adı en az 3 karakter olmalı.");
        }
        if (password.length() < 6) {
            throw new RuntimeException("Şifre en az 6 karakter olmalı.");
        }

        User user = new User(username, hashPassword(password), displayName.isBlank() ? username : displayName);
        String token = UUID.randomUUID().toString();
        user.setSessionToken(token);
        userRepository.save(user);

        return Map.of("token", token, "user", user.toPublicMap());
    }

    // ----- Giriş -----
    public Map<String, Object> login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı adı veya şifre hatalı."));

        if (!user.getPassword().equals(hashPassword(password))) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı.");
        }

        String token = UUID.randomUUID().toString();
        user.setSessionToken(token);
        userRepository.save(user);

        return Map.of("token", token, "user", user.toPublicMap());
    }

    // ----- Token Doğrulama -----
    public User validateAndGetUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Oturum bulunamadı. Lütfen giriş yapın.");
        }
        String token = authHeader.substring(7).trim();
        return userRepository.findBySessionToken(token)
                .orElseThrow(() -> new RuntimeException("Geçersiz veya süresi dolmuş oturum."));
    }

    // ----- Profil Güncelleme -----
    public Map<String, Object> updateProfile(User user, Map<String, Object> body) {
        if (body.containsKey("displayName") && !body.get("displayName").toString().isBlank()) {
            user.setDisplayName(body.get("displayName").toString());
        }
        if (body.containsKey("email")) {
            String email = body.get("email").toString();
            if (!email.isBlank() && !email.equals(user.getEmail())) {
                if (userRepository.existsByEmail(email)) {
                    throw new RuntimeException("Bu e-posta zaten kullanılıyor.");
                }
                user.setEmail(email);
            }
        }
        if (body.containsKey("avatarColor")) {
            user.setAvatarColor(body.get("avatarColor").toString());
        }
        userRepository.save(user);
        return user.toPublicMap();
    }

    // ----- Şifre Değiştirme -----
    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!user.getPassword().equals(hashPassword(oldPassword))) {
            throw new RuntimeException("Mevcut şifre hatalı.");
        }
        if (newPassword.length() < 6) {
            throw new RuntimeException("Yeni şifre en az 6 karakter olmalı.");
        }
        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);
    }

    // ----- Kullanıcı Adı Değiştirme -----
    public Map<String, Object> changeUsername(User user, String newUsername) {
        if (newUsername == null || newUsername.isBlank()) {
            throw new RuntimeException("Kullanıcı adı boş olamaz.");
        }
        newUsername = newUsername.strip().toLowerCase();
        if (newUsername.length() < 3) {
            throw new RuntimeException("Kullanıcı adı en az 3 karakter olmalı.");
        }
        if (!newUsername.matches("[a-z0-9_]{3,30}")) {
            throw new RuntimeException("Sadece küçük harf, rakam ve alt çizgi kullanılabilir.");
        }
        if (newUsername.equals(user.getUsername())) {
            throw new RuntimeException("Yeni kullanıcı adı mevcut ile aynı.");
        }
        if (userRepository.existsByUsername(newUsername)) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor.");
        }

        user.setUsername(newUsername);
        user.setUsernameChangedAt(LocalDateTime.now());
        userRepository.save(user);
        return user.toPublicMap();
    }

    // ----- Çıkış -----
    public void logout(User user) {
        user.setSessionToken(null);
        userRepository.save(user);
    }
}
