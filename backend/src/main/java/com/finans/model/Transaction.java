package com.finans.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * ============================================================
 * OOP - ABSTRACTION (Soyutlama) & ENCAPSULATION (Kapsülleme)
 * ============================================================
 * Transaction, tüm finansal işlemlerin temel soyut sınıfıdır.
 * Doğrudan örneklenemez; Income ve Expense alt sınıfları kullanılır.
 *
 * OOP İlkeleri:
 *  - abstract class    → Abstraction
 *  - private fields    → Encapsulation
 *  - getType()         → Polymorphism (override edilecek)
 *  - Inheritance       → Income ve Expense bu sınıfı extends eder
 */
@Entity
@Table(name = "transactions")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
public abstract class Transaction {

    // ----- ENCAPSULATION: private alanlar -----
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "user_id")
    private Long userId;

    // ----- Constructors -----
    protected Transaction() {}

    protected Transaction(String category, Double amount, String description, LocalDate date) {
        this.category    = category;
        this.amount      = amount;
        this.description = description;
        this.date        = date;
    }

    protected Transaction(String category, Double amount, String description, LocalDate date, Long userId) {
        this(category, amount, description, date);
        this.userId = userId;
    }

    // ----- POLYMORPHISM: alt sınıflar override eder -----
    public abstract String getType();

    public abstract String getSubtype();

    // ----- ENCAPSULATION: Getter / Setter -----
    public Long getId()              { return id; }
    public String getCategory()      { return category; }
    public Double getAmount()        { return amount; }
    public String getDescription()   { return description; }
    public LocalDate getDate()       { return date; }
    public Long getUserId()           { return userId; }

    public void setCategory(String category)       { this.category = category; }
    public void setAmount(Double amount)           { this.amount = amount; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDate date)            { this.date = date; }
    public void setUserId(Long userId)             { this.userId = userId; }

    @Override
    public String toString() {
        return String.format("[%s] %s - %.2f₺ (%s) - %s",
                getType().toUpperCase(), description, amount, category, date);
    }
}
