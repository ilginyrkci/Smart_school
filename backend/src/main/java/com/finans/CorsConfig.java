package com.finans;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS yapılandırması.
 * Vercel frontend'inin Railway backend'ine istek atmasına izin verir.
 */
@Configuration
public class CorsConfig {

    @Value("${FRONTEND_URL:*}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns(frontendUrl.equals("*") ? "*" : frontendUrl)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(!frontendUrl.equals("*"))
                        .maxAge(3600);
            }
        };
    }
}
