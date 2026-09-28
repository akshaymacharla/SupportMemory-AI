package com.supportmemory.repository;

import com.supportmemory.model.MemoryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MemoryEventRepository extends JpaRepository<MemoryEvent, Long> {
    List<MemoryEvent> findByCustomerIdOrderByTimestampDesc(String customerId);
    List<MemoryEvent> findTop10ByOrderByTimestampDesc();
    long countByType(String type);
    void deleteByCustomerId(String customerId);
}
