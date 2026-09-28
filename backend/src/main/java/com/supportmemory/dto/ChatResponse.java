package com.supportmemory.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatResponse {
    private String message;
    private List<MemoryItem> recalledMemories;
    private MemoryItem retainedMemory;
    private boolean memoryUsed;

    public ChatResponse() {
        this.recalledMemories = new ArrayList<>();
    }

    public ChatResponse(String message, List<MemoryItem> recalledMemories, MemoryItem retainedMemory, boolean memoryUsed) {
        this.message = message;
        this.recalledMemories = recalledMemories != null ? recalledMemories : new ArrayList<>();
        this.retainedMemory = retainedMemory;
        this.memoryUsed = memoryUsed;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<MemoryItem> getRecalledMemories() { return recalledMemories; }
    public List<MemoryItem> getMemoriesRecalled() { return recalledMemories; }
    public void setRecalledMemories(List<MemoryItem> recalledMemories) { this.recalledMemories = recalledMemories; }

    public MemoryItem getRetainedMemory() { return retainedMemory; }
    public void setRetainedMemory(MemoryItem retainedMemory) { this.retainedMemory = retainedMemory; }

    public boolean isMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(boolean memoryUsed) { this.memoryUsed = memoryUsed; }
}
