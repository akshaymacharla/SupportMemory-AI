package com.supportmemory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String conversationId;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String role; // "user" or "assistant"

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    private Boolean memoryUsed;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String recalledMemoriesJson;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Message() {}

    public Message(String conversationId, String customerId, String role, String content, Boolean memoryUsed, String recalledMemoriesJson) {
        this.conversationId = conversationId;
        this.customerId = customerId;
        this.role = role;
        this.content = content;
        this.memoryUsed = memoryUsed != null ? memoryUsed : false;
        this.recalledMemoriesJson = recalledMemoriesJson;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (memoryUsed == null) memoryUsed = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(Boolean memoryUsed) { this.memoryUsed = memoryUsed; }

    public String getRecalledMemoriesJson() { return recalledMemoriesJson; }
    public void setRecalledMemoriesJson(String recalledMemoriesJson) { this.recalledMemoriesJson = recalledMemoriesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
