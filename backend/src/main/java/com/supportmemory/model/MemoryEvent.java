package com.supportmemory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "memory_events")
public class MemoryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String type; // RETAIN or RECALL

    @Column(nullable = false, length = 1000)
    private String summary;

    @Column(length = 2000)
    private String details;

    @Column(updatable = false)
    private LocalDateTime timestamp;

    public MemoryEvent() {}

    public MemoryEvent(String customerId, String type, String summary, String details) {
        this.customerId = customerId;
        this.type = type;
        this.summary = summary;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
