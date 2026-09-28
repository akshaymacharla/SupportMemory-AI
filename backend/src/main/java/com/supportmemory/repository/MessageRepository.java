package com.supportmemory.repository;

import com.supportmemory.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCustomerIdOrderByCreatedAtAsc(String customerId);
    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);
    long countByMemoryUsedTrue();
    void deleteByCustomerId(String customerId);
}
