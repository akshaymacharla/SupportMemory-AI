package com.supportmemory.repository;

import com.supportmemory.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByCustomerIdOrderByUpdatedAtDesc(String customerId);
}
