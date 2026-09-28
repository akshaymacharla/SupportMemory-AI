package com.supportmemory.controller;

import com.supportmemory.model.Conversation;
import com.supportmemory.model.Message;
import com.supportmemory.repository.ConversationRepository;
import com.supportmemory.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public ConversationController(ConversationRepository conversationRepository, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping
    public ResponseEntity<List<Conversation>> getConversations(@RequestParam(required = false) String customerId) {
        if (customerId != null && !customerId.isBlank()) {
            return ResponseEntity.ok(conversationRepository.findByCustomerIdOrderByUpdatedAtDesc(customerId));
        }
        return ResponseEntity.ok(conversationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Message>> getConversationMessages(@PathVariable String id) {
        return ResponseEntity.ok(messageRepository.findByConversationIdOrderByCreatedAtAsc(id));
    }
}
