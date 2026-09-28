package com.supportmemory.dto;

import java.util.List;

public class HindsightRecallRequest {
    private String query;
    private Integer max_tokens;
    private String budget;
    private List<String> types;

    public HindsightRecallRequest() {
        this.max_tokens = 4096;
        this.budget = "mid";
    }

    public HindsightRecallRequest(String query) {
        this.query = query;
        this.max_tokens = 4096;
        this.budget = "mid";
    }

    public HindsightRecallRequest(String query, Integer max_tokens, String budget, List<String> types) {
        this.query = query;
        this.max_tokens = max_tokens;
        this.budget = budget;
        this.types = types;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public Integer getMax_tokens() { return max_tokens; }
    public void setMax_tokens(Integer max_tokens) { this.max_tokens = max_tokens; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public List<String> getTypes() { return types; }
    public void setTypes(List<String> types) { this.types = types; }
}
