package com.healthsync.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable for simple REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll() // Allow EVERYTHING (Login, Static files, API)
            )
            .formLogin(form -> form.disable()) // Disable default Spring Login Page
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
