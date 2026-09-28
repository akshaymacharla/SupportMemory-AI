package com.supportmemory.controller;

import com.supportmemory.service.HindsightService;
import com.supportmemory.service.LLMService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    private final HindsightService hindsightService;
    private final LLMService llmService;

    public HealthController(HindsightService hindsightService, LLMService llmService) {
        this.hindsightService = hindsightService;
        this.llmService = llmService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("application", "SupportMemory AI");
        status.put("version", "1.0.0");
        status.put("hindsightConnected", hindsightService.isConnected());
        status.put("llmProvider", llmService.getProviderName());
        status.put("llmModel", llmService.getModelName());
        status.put("llmConfigured", llmService.isConfigured());
        return ResponseEntity.ok(status);
    }
}
