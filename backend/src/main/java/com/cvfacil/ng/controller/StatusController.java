package com.cvfacil.ng.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Slf4j
public class StatusController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("version", "1.0.0-TITANIUM-SRE");
        
        // Health Check do Banco de Dados
        try {
            jdbcTemplate.execute("SELECT 1");
            response.put("database", "ONLINE");
        } catch (Exception e) {
            log.error("[HEALTH-CHECK] Banco de dados OFFLINE: {}", e.getMessage());
            response.put("database", "OFFLINE");
            response.put("database_error", e.getMessage());
            response.put("status", "DEGRADED");
        }
        
        return response;
    }
}
