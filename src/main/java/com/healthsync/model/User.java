package com.healthsync.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id; // MongoDB uses String IDs (ObjectId)

    private String email;
    private String password;
    private String name;
    private String role; // patient, doctor, admin
    private String phone;
    
    // Doctor Specifics
    private String specialty;
    private String qualification;
    
    // JSON blob for availability or other flexible data
    private String availability; // Stores start/end time JSON string

    // Image URL
    private String image;
}
