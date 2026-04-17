package com.finans.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ============================================================
 * OOP - ENCAPSULATION (Kapsülleme)
 * ============================================================
 * Kullanıcı hesap bilgilerini tutan sınıf.
 * Şifre SHA-256 ile hashlenmiş olarak saklanır.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password; // SHA-256 hash

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(unique = true)
    private String email;

    @Column(name = "avatar_color", length = 20)
    private String avatarColor; // Hex renk kodu

    @Column(name = "session_token", unique = true)
    private String sessionToken; // Aktif oturum tokeni (UUID)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Kullanıcı adının en son ne zaman değiştirildiği (14 gün kısıtı için) */
    @Column(name = "username_changed_at")
    private LocalDateTime usernameChangedAt;

    // ----- Constructors -----
    public User() {}

    public User(String username, String password, String displayName) {
        this.username    = username;
        this.password    = password;
        this.displayName = displayName;
        this.avatarColor = "#7c3aed";
        this.createdAt   = LocalDateTime.now();
    }

    // ----- ENCAPSULATION: Getters & Setters -----
    public Long getId()               { return id; }
    public String getUsername()       { return username; }
    public String getPassword()       { return password; }
    public String getDisplayName()    { return displayName; }
    public String getEmail()          { return email; }
    public String getAvatarColor()    { return avatarColor; }
    public String getSessionToken()   { return sessionToken; }
    public LocalDateTime getCreatedAt()         { return createdAt; }
    public LocalDateTime getUsernameChangedAt()   { return usernameChangedAt; }

    public void setUsername(String u)      { this.username = u; }
    public void setPassword(String p)      { this.password = p; }
    public void setDisplayName(String d)   { this.displayName = d; }
    public void setEmail(String e)         { this.email = e; }
    public void setAvatarColor(String c)   { this.avatarColor = c; }
    public void setSessionToken(String t)  { this.sessionToken = t; }
    public void setCreatedAt(LocalDateTime dt)            { this.createdAt = dt; }
    public void setUsernameChangedAt(LocalDateTime dt)    { this.usernameChangedAt = dt; }

    /** Şifre alanı hariç JSON yanıtı için sade kullanıcı verisi */
    public java.util.Map<String, Object> toPublicMap() {
        java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id",          id);
        map.put("username",    username);
        map.put("displayName", displayName);
        map.put("email",       email);
        map.put("avatarColor",        avatarColor);
        map.put("createdAt",           createdAt != null ? createdAt.toString() : null);
        map.put("usernameChangedAt",   usernameChangedAt != null ? usernameChangedAt.toString() : null);
        return map;
    }

    @Override
    public String toString() {
        return String.format("User{id=%d, username='%s', displayName='%s'}", id, username, displayName);
    }
}
