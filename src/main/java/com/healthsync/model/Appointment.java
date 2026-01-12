package com.healthsync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "appointments")
@Data
public class Appointment {

    @Id
    private String id;

    private String patientId; // Now String to match User.id
    private String doctorId;  // Now String to match User.id

    private String date;
    private String time;
    private String status; // Pending, Confirmed, Cancelled
    private String message; // For cancellation reasons
}
