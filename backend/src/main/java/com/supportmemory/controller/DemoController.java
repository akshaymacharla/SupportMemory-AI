package com.supportmemory.controller;

import com.supportmemory.model.Customer;
import com.supportmemory.repository.CustomerRepository;
import com.supportmemory.repository.MessageRepository;
import com.supportmemory.service.HindsightService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    private static final Logger log = LoggerFactory.getLogger(DemoController.class);

    private final HindsightService hindsightService;
    private final MessageRepository messageRepository;
    private final CustomerRepository customerRepository;

    public DemoController(HindsightService hindsightService,
                          MessageRepository messageRepository,
                          CustomerRepository customerRepository) {
        this.hindsightService = hindsightService;
        this.messageRepository = messageRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetDemo(@RequestBody(required = false) Map<String, String> body) {
        String previousSessionId = (body != null) ? body.get("demoSessionId") : null;
        if (previousSessionId != null && !previousSessionId.isBlank()) {
            hindsightService.resetCustomerMemory(previousSessionId);
            messageRepository.deleteByCustomerId(previousSessionId);
            log.info("Cleared previous demo session: {}", previousSessionId);
        }

        // Clean static demo-rahul if previously used
        hindsightService.resetCustomerMemory("demo-rahul");
        messageRepository.deleteByCustomerId("demo-rahul");

        // Generate a completely clean isolated demo session ID
        String newDemoSessionId = "demo-rahul-" + System.currentTimeMillis();

        // Ensure customer profile exists with 0 memories
        Customer demoCustomer = new Customer(newDemoSessionId, "Rahul", "rahul@acme.tech", "Acme Technologies", "Pro", 20);
        customerRepository.save(demoCustomer);

        log.info("Demo reset complete! Fresh demo session created: '{}' with 0 memories.", newDemoSessionId);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Demo reset successfully",
                "demoCustomerId", newDemoSessionId
        ));
    }
}
