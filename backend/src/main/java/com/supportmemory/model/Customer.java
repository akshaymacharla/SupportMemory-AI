package com.supportmemory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String email;

    private String company;

    private String plan;

    private Integer teamSize;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Customer() {}

    public Customer(String id, String name, String email, String company, String plan, Integer teamSize) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.company = company;
        this.plan = plan;
        this.teamSize = teamSize;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
