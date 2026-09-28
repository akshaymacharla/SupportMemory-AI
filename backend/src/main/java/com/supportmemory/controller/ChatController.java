package com.supportmemory.controller;

import com.supportmemory.dto.ChatRequest;
import com.supportmemory.dto.ChatResponse;
import com.supportmemory.service.SupportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final SupportService supportService;

    public ChatController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ChatResponse response = supportService.processChat(request);
        return ResponseEntity.ok(response);
    }
}
