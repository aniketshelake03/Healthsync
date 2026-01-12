package com.healthsync.controller;

import com.healthsync.model.Hospital;
import com.healthsync.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }
    
    @GetMapping("/search")
    public List<Hospital> searchHospitals(@RequestParam String query) {
        return hospitalRepository.findByNameContainingIgnoreCase(query);
    }
}
