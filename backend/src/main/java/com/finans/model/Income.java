package com.finans.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDate;

/**
 * ============================================================
 * OOP - INHERITANCE (Kalıtım)
 * ============================================================
 * Income, Transaction sınıfından kalıtım alır.
 * Gelir türündeki işlemleri temsil eder.
 */
@Entity
@DiscriminatorValue("income")
public class Income extends Transaction {

    public Income() { super(); }

    public Income(String category, Double amount, String description, LocalDate date) {
        super(category, amount, description, date);
    }

    public Income(String category, Double amount, String description, LocalDate date, Long userId) {
        super(category, amount, description, date, userId);
    }

    @Override
    public String getType() { return "income"; }

    @Override
    public String getSubtype() { return null; }

    /** Vergi sonrası net tutar (%15 stopaj) */
    public Double getNetAmount() { return getAmount() * 0.85; }
}
