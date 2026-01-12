package com.healthsync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Document(collection = "hospitals")
@Data
public class Hospital {

    @Id
    private String id;

    private String name;
    private String location;
    private Double rating;
    private String image;

    private List<String> departments;

    // Bed Availability
    private int totalBeds;
    private int availableBeds;
    private int icuBeds;
}
