package com.finans.service;

import com.finans.model.*;
import com.finans.repository.BudgetRepository;
import com.finans.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoachService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public CoachService(TransactionRepository transactionRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository      = budgetRepository;
    }

    public FinancialReport generateReport(Long userId) {
        List<Transaction> all = transactionRepository.findByUserIdOrderByDateDesc(userId);

        double totalIncome   = all.stream().filter(t -> t instanceof Income).mapToDouble(Transaction::getAmount).sum();
        double totalExpenses = all.stream().filter(t -> t instanceof Expense).mapToDouble(Transaction::getAmount).sum();
        double luxury        = all.stream().filter(t -> t instanceof Expense && "luxury".equals(t.getSubtype())).mapToDouble(Transaction::getAmount).sum();

        double budget = budgetRepository.findTopByUserIdOrderByIdDesc(userId)
                .map(Budget::getMonthlyLimit).orElse(12000.0);

        double netSavings  = totalIncome - totalExpenses;
        double savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100.0 : 0.0;
        double luxuryRate  = totalExpenses > 0 ? (luxury / totalExpenses) * 100.0 : 0.0;
        double budgetUsage = budget > 0 ? (totalExpenses / budget) * 100.0 : 0.0;

        int score = 70;
        FinancialReport report = new FinancialReport();

        if (savingsRate < 0) {
            report.addAdvice(new FinancialReport.CoachAdvice("danger","🚨","Açık Finansman!","Gelirinizden daha fazla harcıyorsunuz. Acil önlem alın!"));
            score -= 30;
        } else if (savingsRate < 10) {
            report.addAdvice(new FinancialReport.CoachAdvice("warning","⚠️","Düşük Tasarruf",String.format("Tasarruf oranınız %%%.1f. Hedefiniz en az %%20 olmalı.", savingsRate)));
            score -= 15;
        } else if (savingsRate >= 20) {
            report.addAdvice(new FinancialReport.CoachAdvice("success","🏆","Mükemmel Tasarruf!",String.format("%%%.1f tasarruf oranıyla finansal hedefindesiniz!", savingsRate)));
            score += 15;
        } else {
            report.addAdvice(new FinancialReport.CoachAdvice("info","📈","İyi Gidişat",String.format("%%%.1f tasarruf. Biraz daha artırabilirsiniz.", savingsRate)));
            score += 5;
        }

        if (luxuryRate > 40) {
            report.addAdvice(new FinancialReport.CoachAdvice("warning","🛍️","Yüksek Lüks Harcama",String.format("Giderlerinizin %%%.0f'ı lüks. Hedef: max %%30.", luxuryRate)));
            score -= 15;
        } else if (luxuryRate <= 20 && totalExpenses > 0) {
            report.addAdvice(new FinancialReport.CoachAdvice("success","✅","Kontrollü Lüks Harcama",String.format("Lüks harcamalar %%%.0f ile kontrol altında!", luxuryRate)));
            score += 10;
        }

        if (budgetUsage > 95) {
            report.addAdvice(new FinancialReport.CoachAdvice("danger","🔴","Bütçe Aşımı!",String.format("Bütçenizin %%%.0f'ını kullandınız!", budgetUsage)));
            score -= 20;
        } else if (budgetUsage > 80) {
            report.addAdvice(new FinancialReport.CoachAdvice("warning","🟡","Bütçe Dikkat",String.format("Bütçenizin %%%.0f'ını kullandınız.", budgetUsage)));
            score -= 5;
        }

        report.addAdvice(new FinancialReport.CoachAdvice("tip","💡","50/30/20 Kuralı","Gelirinizin %50'si ihtiyaçlar, %30'u istekler, %20'si tasarruf için ayrılmalı."));

        String grade = score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";
        report.setScore(score); report.setGrade(grade);
        report.setTotalIncome(Math.round(totalIncome * 100.0) / 100.0);
        report.setTotalExpenses(Math.round(totalExpenses * 100.0) / 100.0);
        report.setNetSavings(Math.round(netSavings * 100.0) / 100.0);
        report.setSavingsRate(Math.round(savingsRate * 10.0) / 10.0);
        report.setLuxuryRate(Math.round(luxuryRate * 10.0) / 10.0);
        report.setBudgetUsage(Math.round(budgetUsage * 10.0) / 10.0);
        return report;
    }
}
