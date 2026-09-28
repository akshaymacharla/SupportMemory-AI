package com.supportmemory.config;

import com.supportmemory.dto.MemoryItem;
import com.supportmemory.model.Conversation;
import com.supportmemory.model.Customer;
import com.supportmemory.model.MemoryEvent;
import com.supportmemory.repository.ConversationRepository;
import com.supportmemory.repository.CustomerRepository;
import com.supportmemory.repository.MemoryEventRepository;
import com.supportmemory.service.HindsightService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CustomerRepository customerRepository;
    private final ConversationRepository conversationRepository;
    private final MemoryEventRepository memoryEventRepository;
    private final HindsightService hindsightService;

    public DataInitializer(CustomerRepository customerRepository,
                           ConversationRepository conversationRepository,
                           MemoryEventRepository memoryEventRepository,
                           HindsightService hindsightService) {
        this.customerRepository = customerRepository;
        this.conversationRepository = conversationRepository;
        this.memoryEventRepository = memoryEventRepository;
        this.hindsightService = hindsightService;
    }

    @Override
    public void run(String... args) {
        log.info("Initializing baseline SupportMemory AI demo data...");

        // 1. Seed Customers
        if (customerRepository.count() == 0) {
            Customer rahul = new Customer("rahul-123", "Rahul", "rahul@acme.tech", "Acme Technologies", "Pro", 20);
            Customer sarah = new Customer("sarah-456", "Sarah", "sarah@techflow.io", "TechFlow Inc", "Business", 50);
            customerRepository.saveAll(List.of(rahul, sarah));
            log.info("Seeded default customers: Rahul (Acme Technologies) and Sarah (TechFlow Inc)");
        }

        // 2. Seed Conversations
        if (conversationRepository.count() == 0) {
            Conversation conv1 = new Conversation("conv-rahul-123", "rahul-123", "Google Calendar Integration", "ACTIVE");
            conversationRepository.save(conv1);
        }

        // 3. Seed Memory Events & Initial Memories
        String rahulId = "rahul-123";
        List<MemoryItem> rahulMemories = List.of(
                new MemoryItem("mem-1", "Rahul works at Acme Technologies", "world", 0.98, List.of("Rahul", "Acme Technologies")),
                new MemoryItem("mem-2", "Acme Technologies is on the Pro plan with 20 employees", "world", 0.95, List.of("Acme Technologies", "Pro Plan")),
                new MemoryItem("mem-3", "Rahul uses Google Calendar integration", "world", 0.96, List.of("Rahul", "Google Calendar")),
                new MemoryItem("mem-4", "Acme Technologies uses Google Workspace", "world", 0.92, List.of("Acme Technologies", "Google Workspace")),
                new MemoryItem("mem-5", "Rahul previously reported Google Calendar integration not working", "experience", 0.91, List.of("Rahul", "Google Calendar")),
                new MemoryItem("mem-6", "OAuth permissions were identified as the root cause of the Google Calendar issue", "world", 0.99, List.of("OAuth", "Google Calendar")),
                new MemoryItem("mem-7", "OAuth reauthorization resolved the Google Calendar integration issue", "world", 0.97, List.of("OAuth", "Google Calendar"))
        );
        hindsightService.seedInitialMemories(rahulId, rahulMemories);

        if (memoryEventRepository.count() == 0) {
            memoryEventRepository.saveAll(List.of(
                    new MemoryEvent(rahulId, "RETAIN", "Customer profile: Rahul, Acme Technologies, Pro plan, 20 employees", "Retained from initial introduction"),
                    new MemoryEvent(rahulId, "RETAIN", "Uses Google Calendar integration on Google Workspace", "Retained technical stack context"),
                    new MemoryEvent(rahulId, "RETAIN", "Google Calendar integration reported as not working", "Retained previous incident"),
                    new MemoryEvent(rahulId, "RECALL", "Retrieved Rahul profile and Google Calendar context", "Recalled on follow-up conversation"),
                    new MemoryEvent(rahulId, "RETAIN", "OAuth permissions identified as root cause", "Retained learned root cause"),
                    new MemoryEvent(rahulId, "RETAIN", "OAuth reauthorization resolved the issue", "Retained resolution knowledge"),
                    new MemoryEvent(rahulId, "RECALL", "Retrieved full history: Google Calendar, OAuth, previous solution", "Recalled on fourth interaction")
            ));
        }

        log.info("SupportMemory AI demo baseline ready!");
    }
}
