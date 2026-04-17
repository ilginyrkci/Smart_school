package com.finans;

import com.finans.model.Budget;
import com.finans.model.Expense;
import com.finans.model.Income;
import com.finans.model.User;
import com.finans.repository.BudgetRepository;
import com.finans.repository.TransactionRepository;
import com.finans.repository.UserRepository;
import com.finans.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * DataLoader - Başlangıç verilerini yükler.
 * Demo kullanıcıları ve örnek işlemler oluşturur.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public DataLoader(TransactionRepository tx, BudgetRepository bud,
            UserRepository usr, AuthService auth) {
        this.transactionRepository = tx;
        this.budgetRepository = bud;
        this.userRepository = usr;
        this.authService = auth;
    }

    @Override
    public void run(String... args) throws Exception {

        // Zaten veri yüklüyse tekrar yükleme (Railway yeniden başlatma güvenliği)
        if (userRepository.count() > 0) {
            System.out.println("✅ Veritabanında kullanıcılar mevcut — DataLoader atlanıyor.");
            return;
        }

        // ---- Ana Kullanıcı ----
        User ilgin = new User("ilginyurekci", authService.hashPassword("Ilgın2007."), "İlgın Yürekci");
        ilgin.setEmail("ilginyurekci@example.com");
        ilgin.setAvatarColor("#7c3aed");
        userRepository.save(ilgin);
        Long ilginId = ilgin.getId();

        // ---- Demo Kullanıcı ----
        User demo = new User("demo", authService.hashPassword("demo123"), "Demo Kullanıcısı");
        demo.setEmail("demo@finanskocuu.tr");
        demo.setAvatarColor("#6366f1");
        userRepository.save(demo);
        Long demoId = demo.getId();

        // ---- Bütçeler ----
        budgetRepository.save(new Budget(20000.0, "2026-04", ilginId));
        budgetRepository.save(new Budget(20000.0, "2026-04", demoId));

        // ---- İlgın kullanıcısı işlemleri ----
        transactionRepository.save(new Income("Maaş", 15000.0, "Aylık maaş", LocalDate.of(2026, 4, 1), ilginId));
        transactionRepository
                .save(new Income("Freelance", 3500.0, "Web tasarım projesi", LocalDate.of(2026, 4, 10), ilginId));
        transactionRepository.save(new Income("Temettü", 1200.0, "Yatırım geliri", LocalDate.of(2026, 4, 16), ilginId));
        transactionRepository
                .save(new Expense("Kira", 4500.0, "Nisan ayı kirası", LocalDate.of(2026, 4, 2), "necessary", ilginId));
        transactionRepository.save(
                new Expense("Market", 1200.0, "Haftalık alışveriş", LocalDate.of(2026, 4, 5), "necessary", ilginId));
        transactionRepository.save(new Expense("Faturalar", 420.0, "Elektrik + Su + Net", LocalDate.of(2026, 4, 14),
                "necessary", ilginId));
        transactionRepository
                .save(new Expense("Ulaşım", 300.0, "Toplu taşıma", LocalDate.of(2026, 4, 15), "necessary", ilginId));
        transactionRepository
                .save(new Expense("Eğlence", 650.0, "Sinema & Restoran", LocalDate.of(2026, 4, 7), "luxury", ilginId));
        transactionRepository
                .save(new Expense("Giyim", 950.0, "Yeni kıyafetler", LocalDate.of(2026, 4, 12), "luxury", ilginId));
        transactionRepository.save(new Expense("Abonelikler", 280.0, "Netflix, Spotify, YT", LocalDate.of(2026, 4, 16),
                "luxury", ilginId));

        // ---- Demo kullanıcısı işlemleri ----
        transactionRepository.save(new Income("Maaş", 7500.0, "Aylık maaş", LocalDate.of(2026, 4, 1), demoId));
        transactionRepository
                .save(new Expense("Kira", 2500.0, "Kira ödemesi", LocalDate.of(2026, 4, 2), "necessary", demoId));
        transactionRepository
                .save(new Expense("Market", 600.0, "Market alışveriş", LocalDate.of(2026, 4, 8), "necessary", demoId));
        transactionRepository
                .save(new Expense("Eğlence", 400.0, "Eğlence", LocalDate.of(2026, 4, 11), "luxury", demoId));

        System.out.println("✅ " + transactionRepository.count() + " işlem yüklendi.");
        System.out.println("✅ Kullanıcılar: ilginyurekci/Ilgın2007. | demo/demo123");
    }
}

