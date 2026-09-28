package com.supportmemory.dto;

public class ChatRequest {
    private String customerId;
    private String message;
    private Boolean useMemory;

    public ChatRequest() {
        this.useMemory = true;
    }

    public ChatRequest(String customerId, String message, Boolean useMemory) {
        this.customerId = customerId;
        this.message = message;
        this.useMemory = useMemory != null ? useMemory : true;
    }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getUseMemory() { return useMemory != null ? useMemory : true; }
    public void setUseMemory(Boolean useMemory) { this.useMemory = useMemory; }
}
