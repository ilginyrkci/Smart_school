package com.finans.model;

/**
 * ============================================================
 * OOP - ENCAPSULATION + COMPOSITION
 * ============================================================
 * Finans koçunun ürettiği analiz raporunu temsil eder.
 * Bu sınıf herhangi bir JPA entity değil; saf bir Java nesnesidir.
 * CoachService tarafından oluşturulur ve Controller'a döndürülür.
 */
public class FinancialReport {

    private int    score;        // 0-100 puan
    private String grade;        // A/B/C/D/F
    private double totalIncome;
    private double totalExpenses;
    private double netSavings;
    private double savingsRate;
    private double luxuryRate;
    private double budgetUsage;
    private java.util.List<CoachAdvice> advices;

    public FinancialReport() {
        this.advices = new java.util.ArrayList<>();
    }

    // ----- Inner class (Composition) -----
    public static class CoachAdvice {
        private String level;   // "danger", "warning", "success", "tip"
        private String icon;
        private String title;
        private String message;

        public CoachAdvice(String level, String icon, String title, String message) {
            this.level   = level;
            this.icon    = icon;
            this.title   = title;
            this.message = message;
        }

        public String getLevel()   { return level; }
        public String getIcon()    { return icon; }
        public String getTitle()   { return title; }
        public String getMessage() { return message; }
    }

    // ----- Getters & Setters -----
    public int getScore()               { return score; }
    public String getGrade()            { return grade; }
    public double getTotalIncome()      { return totalIncome; }
    public double getTotalExpenses()    { return totalExpenses; }
    public double getNetSavings()       { return netSavings; }
    public double getSavingsRate()      { return savingsRate; }
    public double getLuxuryRate()       { return luxuryRate; }
    public double getBudgetUsage()      { return budgetUsage; }
    public java.util.List<CoachAdvice> getAdvices() { return advices; }

    public void setScore(int score)                { this.score = Math.max(0, Math.min(100, score)); }
    public void setGrade(String grade)             { this.grade = grade; }
    public void setTotalIncome(double v)           { this.totalIncome = v; }
    public void setTotalExpenses(double v)         { this.totalExpenses = v; }
    public void setNetSavings(double v)            { this.netSavings = v; }
    public void setSavingsRate(double v)           { this.savingsRate = v; }
    public void setLuxuryRate(double v)            { this.luxuryRate = v; }
    public void setBudgetUsage(double v)           { this.budgetUsage = v; }
    public void addAdvice(CoachAdvice a)           { this.advices.add(a); }
}
