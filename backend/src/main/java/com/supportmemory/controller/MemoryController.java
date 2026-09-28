package com.supportmemory.controller;

import com.supportmemory.dto.MemoryItem;
import com.supportmemory.model.MemoryEvent;
import com.supportmemory.repository.MemoryEventRepository;
import com.supportmemory.service.HindsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memory")
@CrossOrigin(origins = "*")
public class MemoryController {

    private final HindsightService hindsightService;
    private final MemoryEventRepository memoryEventRepository;

    public MemoryController(HindsightService hindsightService, MemoryEventRepository memoryEventRepository) {
        this.hindsightService = hindsightService;
        this.memoryEventRepository = memoryEventRepository;
    }

    @GetMapping("/recall")
    public ResponseEntity<List<MemoryItem>> getMemories(@RequestParam(defaultValue = "rahul-123") String customerId) {
        return ResponseEntity.ok(hindsightService.getAllMemories(customerId));
    }

    @GetMapping("/events")
    public ResponseEntity<List<MemoryEvent>> getMemoryEvents(@RequestParam(required = false) String customerId) {
        if (customerId != null && !customerId.isBlank()) {
            return ResponseEntity.ok(memoryEventRepository.findByCustomerIdOrderByTimestampDesc(customerId));
        }
        return ResponseEntity.ok(memoryEventRepository.findTop10ByOrderByTimestampDesc());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMemoryStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRetained", memoryEventRepository.countByType("RETAIN"));
        stats.put("totalRecalled", memoryEventRepository.countByType("RECALL"));
        stats.put("hindsightConnected", hindsightService.isConnected());
        return ResponseEntity.ok(stats);
    }
}
