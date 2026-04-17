package com.finans.service;

import com.finans.model.Expense;
import com.finans.model.Income;
import com.finans.model.Transaction;
import com.finans.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> getAllTransactions(Long userId) {
        return repository.findByUserIdOrderByDateDesc(userId);
    }

    /**
     * POLYMORPHISM: type'a göre Income veya Expense oluşturulur.
     */
    public Transaction createTransaction(Map<String, Object> body, Long userId) {
        String type        = (String) body.get("type");
        String category    = (String) body.get("category");
        Double amount      = Double.parseDouble(body.get("amount").toString());
        String description = (String) body.get("description");
        LocalDate date     = LocalDate.parse(body.get("date").toString());

        Transaction transaction;

        if ("income".equals(type)) {
            transaction = new Income(category, amount, description, date, userId);
        } else {
            String subtype = (String) body.getOrDefault("subtype", "necessary");
            transaction = new Expense(category, amount, description, date, subtype, userId);
        }

        return repository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Map<String, Object> body, Long userId) {
        Optional<Transaction> opt = repository.findById(id);
        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) return null;

        Transaction existing = opt.get();
        String newType = (String) body.getOrDefault("type", existing.getType());

        // Tip değişmişse eski kaydı sil, yeni kayıt oluştur
        if (!newType.equals(existing.getType())) {
            repository.deleteById(id);
            return createTransaction(body, userId);
        }

        // Aynı tip — alanları güncelle
        if (body.containsKey("category"))    existing.setCategory((String) body.get("category"));
        if (body.containsKey("amount"))      existing.setAmount(Double.parseDouble(body.get("amount").toString()));
        if (body.containsKey("description")) existing.setDescription((String) body.get("description"));
        if (body.containsKey("date"))        existing.setDate(java.time.LocalDate.parse(body.get("date").toString()));
        if (existing instanceof com.finans.model.Expense exp && body.containsKey("subtype")) {
            exp.setSubtype((String) body.get("subtype"));
        }

        return repository.save(existing);
    }

    public boolean deleteTransaction(Long id, Long userId) {
        Optional<Transaction> tx = repository.findById(id);
        if (tx.isEmpty() || !tx.get().getUserId().equals(userId)) return false;
        repository.deleteById(id);
        return true;
    }

    public List<Transaction> getIncomes(Long userId) {
        return repository.findByUserIdOrderByDateDesc(userId).stream()
                .filter(t -> t instanceof Income)
                .toList();
    }

    public List<Transaction> getExpenses(Long userId) {
        return repository.findByUserIdOrderByDateDesc(userId).stream()
                .filter(t -> t instanceof Expense)
                .toList();
    }
}
