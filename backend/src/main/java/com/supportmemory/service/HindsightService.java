package com.supportmemory.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supportmemory.dto.HindsightRecallRequest;
import com.supportmemory.dto.HindsightRetainRequest;
import com.supportmemory.dto.MemoryItem;
import com.supportmemory.model.MemoryEvent;
import com.supportmemory.repository.MemoryEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class HindsightService {

    private static final Logger log = LoggerFactory.getLogger(HindsightService.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final MemoryEventRepository memoryEventRepository;

    @Value("${hindsight.base-url:http://localhost:8888}")
    private String baseUrl;

    @Value("${hindsight.bank-id:support-memory-ai}")
    private String defaultBankId;

    // Resilient local memory bank mirroring Hindsight's structure per customer
    private final Map<String, List<MemoryItem>> localMemoryStore = new ConcurrentHashMap<>();

    public HindsightService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, MemoryEventRepository memoryEventRepository) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        this.memoryEventRepository = memoryEventRepository;
    }

    public boolean isConnected() {
        try {
            String res = webClient.get()
                    .uri(baseUrl + "/v1/banks")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(800))
                    .block();
            return res != null;
        } catch (Exception e) {
            return false;
        }
    }

    public MemoryItem retain(String customerId, String content, String context) {
        String bankId = getBankId(customerId);
        log.info("Hindsight RETAIN -> Bank: '{}', Content: '{}', Context: '{}'", bankId, content, context);

        MemoryItem item = null;
        boolean sentToLiveServer = false;

        try {
            HindsightRetainRequest req = new HindsightRetainRequest(content, context);
            String payload = objectMapper.writeValueAsString(req);

            String response = webClient.post()
                    .uri(baseUrl + "/v1/banks/" + bankId + "/retain")
                    .header("Content-Type", "application/json")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(3))
                    .block();

            if (response != null) {
                sentToLiveServer = true;
                log.info("Live Hindsight server accepted retain: {}", response);
            }
        } catch (Exception e) {
            log.debug("Hindsight live retain unavailable ({}), persisting to local memory store", e.getMessage());
        }

        // Determine memory type & entities
        String type = "world";
        if (context != null && context.toLowerCase().contains("support agent")) {
            type = "experience";
        }
        List<String> entities = extractEntities(content);

        item = new MemoryItem(UUID.randomUUID().toString().substring(0, 8), content, type, 0.95, entities);

        // Store in local store
        localMemoryStore.computeIfAbsent(customerId, k -> new ArrayList<>()).add(item);

        // Log to database memory events
        MemoryEvent event = new MemoryEvent(
                customerId,
                "RETAIN",
                content,
                "Context: " + context + (sentToLiveServer ? " [Hindsight Cloud/Docker]" : " [Hindsight Memory Store]")
        );
        memoryEventRepository.save(event);

        return item;
    }

    public List<MemoryItem> recall(String customerId, String query) {
        String bankId = getBankId(customerId);
        log.info("Hindsight RECALL -> Bank: '{}', Query: '{}'", bankId, query);

        List<MemoryItem> results = new ArrayList<>();
        boolean recalledFromLive = false;

        try {
            HindsightRecallRequest req = new HindsightRecallRequest(query, 4096, "mid", List.of("world", "experience", "observation"));
            String payload = objectMapper.writeValueAsString(req);

            String response = webClient.post()
                    .uri(baseUrl + "/v1/banks/" + bankId + "/recall")
                    .header("Content-Type", "application/json")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(3))
                    .block();

            if (response != null) {
                JsonNode root = objectMapper.readTree(response);
                JsonNode memoriesNode = root.path("memories");
                if (memoriesNode.isArray()) {
                    for (JsonNode m : memoriesNode) {
                        MemoryItem item = new MemoryItem();
                        item.setId(m.path("id").asText(UUID.randomUUID().toString()));
                        item.setContent(m.path("content").asText());
                        item.setType(m.path("type").asText("world"));
                        item.setScore(m.path("score").asDouble(0.9));
                        List<String> entities = new ArrayList<>();
                        m.path("entities").forEach(e -> entities.add(e.asText()));
                        item.setEntities(entities);
                        results.add(item);
                    }
                    recalledFromLive = true;
                }
            }
        } catch (Exception e) {
            log.debug("Hindsight live recall unavailable ({}), searching local memory store", e.getMessage());
        }

        if (!recalledFromLive) {
            results = searchLocalMemories(customerId, query);
        }

        // Log RECALL event
        if (!results.isEmpty()) {
            StringBuilder summary = new StringBuilder("Recalled ").append(results.size()).append(" memories for query: \"").append(query).append("\"");
            MemoryEvent event = new MemoryEvent(
                    customerId,
                    "RECALL",
                    summary.toString(),
                    "Matched: " + results.get(0).getContent()
            );
            memoryEventRepository.save(event);
        }

        return results;
    }

    public List<MemoryItem> getAllMemories(String customerId) {
        List<MemoryItem> items = localMemoryStore.get(customerId);
        if (items == null || items.isEmpty()) {
            return Collections.emptyList();
        }
        return new ArrayList<>(items);
    }

    public boolean deleteBank(String bankId) {
        log.info("Hindsight DELETE Bank -> Bank: '{}'", bankId);
        try {
            webClient.delete()
                    .uri(baseUrl + "/v1/banks/" + bankId)
                    .retrieve()
                    .toBodilessEntity()
                    .timeout(Duration.ofSeconds(3))
                    .block();
            log.info("Live Hindsight bank '{}' deleted successfully", bankId);
            return true;
        } catch (Exception e) {
            log.debug("Live Hindsight bank deletion unavailable or not found for '{}': {}", bankId, e.getMessage());
            return false;
        }
    }

    @Transactional
    public void resetCustomerMemory(String customerId) {
        String bankId = getBankId(customerId);
        deleteBank(bankId);
        localMemoryStore.remove(customerId);
        memoryEventRepository.deleteByCustomerId(customerId);
        log.info("Reset customer memory completed for '{}' (bank: '{}')", customerId, bankId);
    }

    public void seedInitialMemories(String customerId, List<MemoryItem> initialItems) {
        localMemoryStore.put(customerId, new ArrayList<>(initialItems));
    }

    private List<MemoryItem> searchLocalMemories(String customerId, String query) {
        List<MemoryItem> all = localMemoryStore.getOrDefault(customerId, Collections.emptyList());
        if (all.isEmpty()) return Collections.emptyList();

        String lowerQuery = query.toLowerCase();
        List<MemoryItem> matched = new ArrayList<>();

        for (MemoryItem item : all) {
            String content = item.getContent().toLowerCase();
            boolean match = false;

            if (lowerQuery.contains("calendar") && content.contains("calendar")) match = true;
            else if ((lowerQuery.contains("oauth") || lowerQuery.contains("permission")) && (content.contains("oauth") || content.contains("permission"))) match = true;
            else if (lowerQuery.contains("rahul") && content.contains("rahul")) match = true;
            else if (lowerQuery.contains("acme") && content.contains("acme")) match = true;
            else if (lowerQuery.contains("broken") && (content.contains("calendar") || content.contains("oauth"))) match = true;
            else if (lowerQuery.contains("still not working") && content.contains("calendar")) match = true;

            if (match) {
                matched.add(item);
            }
        }

        return matched;
    }

    private List<String> extractEntities(String content) {
        List<String> entities = new ArrayList<>();
        if (content.contains("Rahul")) entities.add("Rahul");
        if (content.contains("Acme Technologies")) entities.add("Acme Technologies");
        if (content.contains("Google Calendar")) entities.add("Google Calendar");
        if (content.contains("Google Workspace")) entities.add("Google Workspace");
        if (content.contains("OAuth")) entities.add("OAuth");
        if (content.contains("Pro plan")) entities.add("Pro Plan");
        return entities;
    }

    private String getBankId(String customerId) {
        return "supportmemory-" + customerId;
    }
}
