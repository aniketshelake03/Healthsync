package com.healthsync.repository;

import com.healthsync.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HospitalRepository extends MongoRepository<Hospital, String> {
    List<Hospital> findByNameContainingIgnoreCase(String name);
}
