package com.supportmemory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supportmemory.dto.ChatRequest;
import com.supportmemory.dto.ChatResponse;
import com.supportmemory.dto.MemoryItem;
import com.supportmemory.model.Customer;
import com.supportmemory.model.Message;
import com.supportmemory.repository.CustomerRepository;
import com.supportmemory.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupportService {

    private static final Logger log = LoggerFactory.getLogger(SupportService.class);

    private final HindsightService hindsightService;
    private final LLMService llmService;
    private final CustomerRepository customerRepository;
    private final MessageRepository messageRepository;
    private final ObjectMapper objectMapper;

    public SupportService(HindsightService hindsightService,
                          LLMService llmService,
                          CustomerRepository customerRepository,
                          MessageRepository messageRepository,
                          ObjectMapper objectMapper) {
        this.hindsightService = hindsightService;
        this.llmService = llmService;
        this.customerRepository = customerRepository;
        this.messageRepository = messageRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ChatResponse processChat(ChatRequest request) {
        String customerId = request.getCustomerId() != null ? request.getCustomerId() : "rahul-123";
        String userMessage = request.getMessage();
        boolean useMemory = request.getUseMemory();

        Customer customer = customerRepository.findById(customerId).orElse(
                new Customer(customerId, "Rahul", "rahul@acme.tech", "Acme Technologies", "Pro", 20)
        );

        List<MemoryItem> recalledMemories = new ArrayList<>();
        if (useMemory) {
            recalledMemories = hindsightService.recall(customerId, userMessage);
        }

        // Build System Prompt
        StringBuilder sysPrompt = new StringBuilder();
        sysPrompt.append("You are SupportMemory AI, a proactive, context-aware AI customer support agent.\n");
        sysPrompt.append("Customer: ").append(customer.getName())
                .append(", Company: ").append(customer.getCompany())
                .append(", Plan: ").append(customer.getPlan())
                .append(", Team Size: ").append(customer.getTeamSize()).append(".\n\n");

        if (useMemory && !recalledMemories.isEmpty()) {
            sysPrompt.append("--- RECALLED CUSTOMER MEMORIES (FROM HINDSIGHT) ---\n");
            for (MemoryItem mem : recalledMemories) {
                sysPrompt.append("• [").append(mem.getType()).append("] ").append(mem.getContent()).append("\n");
            }
            sysPrompt.append("---------------------------------------------------\n");
            sysPrompt.append("INSTRUCTIONS:\n");
            sysPrompt.append("1. Acknowledge and utilize the recalled memories directly.\n");
            sysPrompt.append("2. Do NOT ask the customer to repeat information that is already in memory (e.g. company, plan, software stack).\n");
            sysPrompt.append("3. If previous troubleshooting or root cause (such as OAuth permissions) was recorded, build immediately upon it.\n");
            sysPrompt.append("4. Provide targeted, personalized, and efficient troubleshooting.\n");
        } else {
            sysPrompt.append("Note: No previous memory context is available for this customer. Respond as a standard generic support bot.\n");
        }

        // Generate response with LLM
        String responseText = llmService.generateResponse(sysPrompt.toString(), userMessage);

        // Retain new knowledge in Hindsight if memory is active
        MemoryItem retainedMemory = null;
        if (useMemory) {
            String usefulFact = extractUsefulFact(userMessage);
            if (usefulFact != null) {
                retainedMemory = hindsightService.retain(
                        customerId,
                        usefulFact,
                        "Customer " + customer.getName() + " is speaking to the support agent"
                );
            }
        }

        // Persist messages
        try {
            String recalledJson = objectMapper.writeValueAsString(recalledMemories);

            Message userMsg = new Message(
                    "conv-" + customerId,
                    customerId,
                    "user",
                    userMessage,
                    false,
                    null
            );
            messageRepository.save(userMsg);

            Message assistantMsg = new Message(
                    "conv-" + customerId,
                    customerId,
                    "assistant",
                    responseText,
                    useMemory && !recalledMemories.isEmpty(),
                    recalledJson
            );
            messageRepository.save(assistantMsg);
        } catch (Exception e) {
            log.warn("Failed to persist chat messages: {}", e.getMessage());
        }

        return new ChatResponse(responseText, recalledMemories, retainedMemory, useMemory);
    }

    private String extractUsefulFact(String message) {
        String lower = message.toLowerCase();

        if (lower.contains("rahul") && lower.contains("acme")) {
            return "Rahul works at Acme Technologies on the Pro plan with 20 employees and uses Google Calendar integration";
        }
        if (lower.contains("calendar") && (lower.contains("not working") || lower.contains("isn't working") || lower.contains("still not working"))) {
            return "Rahul reported Google Calendar integration failure";
        }
        if (lower.contains("oauth") || lower.contains("permission")) {
            return "OAuth permissions were identified as the root cause of the Google Calendar integration issue";
        }
        if (lower.contains("didn't work") || lower.contains("failed")) {
            return "Initial Google Calendar troubleshooting failed to resolve the issue";
        }
        if (lower.contains("broken again")) {
            return "Recurring Google Calendar issue observed for Acme Technologies";
        }

        // If the user provided detailed text
        if (message.length() > 25 && !lower.startsWith("hi") && !lower.startsWith("hello")) {
            return message.trim();
        }

        return null;
    }
}
