package com.healthsync.controller;

import com.healthsync.model.Appointment;
import com.healthsync.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/patient/{id}")
    public List<Appointment> getPatientAppointments(@PathVariable String id) {
        return appointmentRepository.findByPatientId(id);
    }

    @GetMapping("/doctor/{id}")
    public List<Appointment> getDoctorAppointments(@PathVariable String id) {
        return appointmentRepository.findByDoctorId(id);
    }

    @PostMapping("/book")
    public Appointment bookAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus("Confirmed"); // Auto confirm for MVP
        // TODO: Validate doctor/patient IDs exist
        return appointmentRepository.save(appointment);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Appointment update) {
        return appointmentRepository.findById(id).map(appt -> {
            appt.setStatus(update.getStatus());
            appt.setMessage(update.getMessage());
            return ResponseEntity.ok(appointmentRepository.save(appt));
        }).orElse(ResponseEntity.notFound().build());
    }
}
