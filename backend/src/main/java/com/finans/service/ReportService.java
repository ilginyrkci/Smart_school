package com.finans.service;

import com.finans.model.Expense;
import com.finans.model.Income;
import com.finans.model.Transaction;
import com.finans.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final TransactionRepository repository;

    public ReportService(TransactionRepository repository) {
        this.repository = repository;
    }

    public Map<String, Object> getSummary(Long userId) {
        List<Transaction> all = repository.findByUserIdOrderByDateDesc(userId);
        double totalIncome   = all.stream().filter(t -> t instanceof Income).mapToDouble(Transaction::getAmount).sum();
        double totalExpenses = all.stream().filter(t -> t instanceof Expense).mapToDouble(Transaction::getAmount).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalIncome",      Math.round(totalIncome * 100.0) / 100.0);
        result.put("totalExpenses",    Math.round(totalExpenses * 100.0) / 100.0);
        result.put("netBalance",       Math.round((totalIncome - totalExpenses) * 100.0) / 100.0);
        result.put("transactionCount", all.size());
        result.put("incomeCount",      (int) all.stream().filter(t -> t instanceof Income).count());
        result.put("expenseCount",     (int) all.stream().filter(t -> t instanceof Expense).count());
        return result;
    }

    public List<Map<String, Object>> getCategoryBreakdown(Long userId) {
        List<Transaction> expenses = repository.findByUserIdOrderByDateDesc(userId).stream()
                .filter(t -> t instanceof Expense).toList();

        Map<String, Double> categoryMap = new LinkedHashMap<>();
        Map<String, String> subtypeMap  = new LinkedHashMap<>();

        for (Transaction t : expenses) {
            categoryMap.merge(t.getCategory(), t.getAmount(), Double::sum);
            subtypeMap.putIfAbsent(t.getCategory(), t.getSubtype());
        }

        double total = categoryMap.values().stream().mapToDouble(Double::doubleValue).sum();
        return categoryMap.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("name",    e.getKey());
                    item.put("amount",  Math.round(e.getValue() * 100.0) / 100.0);
                    item.put("subtype", subtypeMap.get(e.getKey()));
                    item.put("percent", total > 0 ? Math.round((e.getValue() / total) * 1000.0) / 10.0 : 0);
                    return item;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMonthlyTrend(Long userId) {
        List<Transaction> all = repository.findByUserIdOrderByDateDesc(userId);
        Locale locale = new Locale("tr", "TR");
        return Arrays.stream(Month.values())
                .filter(m -> m.getValue() <= java.time.LocalDate.now().getMonthValue())
                .map(month -> {
                    double inc = all.stream()
                            .filter(t -> t instanceof Income && t.getDate().getMonth() == month)
                            .mapToDouble(Transaction::getAmount).sum();
                    double exp = all.stream()
                            .filter(t -> t instanceof Expense && t.getDate().getMonth() == month)
                            .mapToDouble(Transaction::getAmount).sum();
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("month",    month.getDisplayName(TextStyle.SHORT, locale));
                    item.put("income",   Math.round(inc * 100.0) / 100.0);
                    item.put("expenses", Math.round(exp * 100.0) / 100.0);
                    return item;
                })
                .collect(Collectors.toList());
    }
}
