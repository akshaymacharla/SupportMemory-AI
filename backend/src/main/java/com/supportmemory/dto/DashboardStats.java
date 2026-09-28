package com.supportmemory.dto;

public class DashboardStats {
    private long totalCustomers;
    private long totalConversations;
    private long memoriesRetained;
    private long memoriesRecalled;
    private long memoryEnhancedChats;

    public DashboardStats() {}

    public DashboardStats(long totalCustomers, long totalConversations, long memoriesRetained, long memoriesRecalled, long memoryEnhancedChats) {
        this.totalCustomers = totalCustomers;
        this.totalConversations = totalConversations;
        this.memoriesRetained = memoriesRetained;
        this.memoriesRecalled = memoriesRecalled;
        this.memoryEnhancedChats = memoryEnhancedChats;
    }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalConversations() { return totalConversations; }
    public void setTotalConversations(long totalConversations) { this.totalConversations = totalConversations; }

    public long getMemoriesRetained() { return memoriesRetained; }
    public void setMemoriesRetained(long memoriesRetained) { this.memoriesRetained = memoriesRetained; }

    public long getMemoriesRecalled() { return memoriesRecalled; }
    public void setMemoriesRecalled(long memoriesRecalled) { this.memoriesRecalled = memoriesRecalled; }

    public long getMemoryEnhancedChats() { return memoryEnhancedChats; }
    public void setMemoryEnhancedChats(long memoryEnhancedChats) { this.memoryEnhancedChats = memoryEnhancedChats; }
}
