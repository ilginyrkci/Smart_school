package com.finans;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Akıllı Harçlık & Finans Koçu - Spring Boot Uygulaması
 * Nesne Tabanlı Programlama Final Projesi
 */
@SpringBootApplication
public class FinansApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinansApplication.class, args);
        System.out.println("""
                
                ╔══════════════════════════════════════════════════╗
                ║   Akıllı Harçlık & Finans Koçu - API Başladı!   ║
                ║   Backend: http://localhost:8080                  ║
                ║   H2 Console: http://localhost:8080/h2-console    ║
                ╚══════════════════════════════════════════════════╝
                """);
    }
}
