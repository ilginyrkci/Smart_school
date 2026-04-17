package com.finans.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDate;

/**
 * ============================================================
 * OOP - INHERITANCE (Kalıtım) + ENCAPSULATION
 * ============================================================
 */
@Entity
@DiscriminatorValue("expense")
public class Expense extends Transaction {

    @Column(name = "subtype")
    private String subtype;

    public Expense() { super(); }

    public Expense(String category, Double amount, String description, LocalDate date, String subtype) {
        super(category, amount, description, date);
        this.subtype = subtype;
    }

    public Expense(String category, Double amount, String description, LocalDate date, String subtype, Long userId) {
        super(category, amount, description, date, userId);
        this.subtype = subtype;
    }

    @Override
    public String getType()    { return "expense"; }

    @Override
    public String getSubtype() { return subtype; }

    public boolean isLuxury()    { return "luxury".equalsIgnoreCase(subtype); }
    public boolean isNecessary() { return "necessary".equalsIgnoreCase(subtype); }
    public boolean exceedsBudget(Double limit) { return getAmount() > limit; }

    public void setSubtype(String subtype) { this.subtype = subtype; }
}
