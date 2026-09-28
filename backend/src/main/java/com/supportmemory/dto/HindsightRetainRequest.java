package com.supportmemory.dto;

public class HindsightRetainRequest {
    private String content;
    private String context;

    public HindsightRetainRequest() {}

    public HindsightRetainRequest(String content, String context) {
        this.content = content;
        this.context = context;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
