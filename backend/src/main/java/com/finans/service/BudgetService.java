package com.finans.service;

import com.finans.model.Budget;
import com.finans.model.Expense;
import com.finans.model.Transaction;
import com.finans.repository.BudgetRepository;
import com.finans.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository, TransactionRepository transactionRepository) {
        this.budgetRepository      = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getBudgetSummary(Long userId) {
        Budget budget = budgetRepository.findTopByUserIdOrderByIdDesc(userId)
                .orElse(new Budget(12000.0, LocalDate.now().toString().substring(0, 7), userId));

        List<Transaction> all = transactionRepository.findByUserIdOrderByDateDesc(userId);

        double totalExpenses = all.stream().filter(t -> t instanceof Expense)
                .mapToDouble(Transaction::getAmount).sum();
        double necessary = all.stream()
                .filter(t -> t instanceof Expense && "necessary".equals(t.getSubtype()))
                .mapToDouble(Transaction::getAmount).sum();
        double luxury = all.stream()
                .filter(t -> t instanceof Expense && "luxury".equals(t.getSubtype()))
                .mapToDouble(Transaction::getAmount).sum();

        double percentage = budget.getMonthlyLimit() > 0
                ? Math.min(100.0, (totalExpenses / budget.getMonthlyLimit()) * 100.0) : 0.0;

        Map<String, Object> result = new HashMap<>();
        result.put("id",           budget.getId());
        result.put("monthlyLimit", budget.getMonthlyLimit());
        result.put("month",        budget.getMonth());
        result.put("totalExpenses",Math.round(totalExpenses * 100.0) / 100.0);
        result.put("remaining",    Math.round((budget.getMonthlyLimit() - totalExpenses) * 100.0) / 100.0);
        result.put("percentage",   Math.round(percentage * 10.0) / 10.0);
        result.put("necessary",    Math.round(necessary * 100.0) / 100.0);
        result.put("luxury",       Math.round(luxury * 100.0) / 100.0);
        return result;
    }

    public Budget updateLimit(Long userId, Double newLimit) {
        Budget budget = budgetRepository.findTopByUserIdOrderByIdDesc(userId)
                .orElse(new Budget(newLimit, LocalDate.now().toString().substring(0, 7), userId));
        budget.setMonthlyLimit(newLimit);
        budget.setUserId(userId);
        return budgetRepository.save(budget);
    }
}
