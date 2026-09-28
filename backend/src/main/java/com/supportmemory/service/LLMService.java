package com.supportmemory.service;

public interface LLMService {
    String generateResponse(String systemPrompt, String userMessage);
    String getProviderName();
    String getModelName();
    boolean isConfigured();
}
