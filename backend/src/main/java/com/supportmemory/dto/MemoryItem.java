package com.supportmemory.dto;

import java.util.ArrayList;
import java.util.List;

public class MemoryItem {
    private String id;
    private String text; // For UI compatibility ('text' or 'content')
    private String content;
    private String type; // world, experience, observation
    private Double score;
    private List<String> entities;

    public MemoryItem() {
        this.entities = new ArrayList<>();
    }

    public MemoryItem(String id, String content, String type, Double score, List<String> entities) {
        this.id = id;
        this.content = content;
        this.text = content;
        this.type = type;
        this.score = score;
        this.entities = entities != null ? entities : new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text != null ? text : content; }
    public void setText(String text) {
        this.text = text;
        if (this.content == null) this.content = text;
    }

    public String getContent() { return content != null ? content : text; }
    public void setContent(String content) {
        this.content = content;
        if (this.text == null) this.text = content;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public List<String> getEntities() { return entities != null ? entities : new ArrayList<>(); }
    public void setEntities(List<String> entities) { this.entities = entities; }
}
