package com.finans.model;

import jakarta.persistence.*;

/**
 * ============================================================
 * OOP - ENCAPSULATION (Kapsülleme)
 * ============================================================
 * Kullanıcının aylık bütçe bilgilerini tutan sınıf.
 */
@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monthly_limit", nullable = false)
    private Double monthlyLimit;

    @Column(name = "budget_month", nullable = false)
    private String month;

    @Column(name = "user_id")
    private Long userId;

    // ----- Constructors -----
    public Budget() {}

    public Budget(Double monthlyLimit, String month) {
        this.monthlyLimit = monthlyLimit;
        this.month        = month;
    }

    public Budget(Double monthlyLimit, String month, Long userId) {
        this.monthlyLimit = monthlyLimit;
        this.month        = month;
        this.userId       = userId;
    }

    // ----- ENCAPSULATION: Getters & Setters -----
    public Long getId()             { return id; }
    public Double getMonthlyLimit() { return monthlyLimit; }
    public String getMonth()        { return month; }
    public Long getUserId()         { return userId; }

    public void setMonthlyLimit(Double monthlyLimit) { this.monthlyLimit = monthlyLimit; }
    public void setMonth(String month)               { this.month = month; }
    public void setUserId(Long userId)               { this.userId = userId; }

    @Override
    public String toString() {
        return String.format("Budget{month='%s', limit=%.2f₺, userId=%d}", month, monthlyLimit, userId);
    }
}
