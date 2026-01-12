package com.healthsync.config;

import com.healthsync.model.Hospital;
import com.healthsync.model.User;
import com.healthsync.repository.HospitalRepository;
import com.healthsync.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    private Hospital createHospital(String name, String location, double rating, String image, List<String> departments, int total, int available, int icu) {
        Hospital h = new Hospital();
        h.setName(name);
        h.setLocation(location);
        h.setRating(rating);
        h.setImage(image);
        h.setDepartments(departments);
        h.setTotalBeds(total);
        h.setAvailableBeds(available);
        h.setIcuBeds(icu);
        return h;
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepo, HospitalRepository hospitalRepo) {
        return args -> {
            // 1. Initialize Users if empty
            if (userRepo.count() == 0) {
                System.out.println("Seeding Users...");

                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@health.com");
                admin.setPassword("123"); 
                admin.setRole("admin");
                admin.setImage("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");

                User doctor = new User();
                doctor.setName("Dr. Sarah Smith");
                doctor.setEmail("doctor@health.com");
                doctor.setPassword("123");
                doctor.setRole("doctor");
                doctor.setSpecialty("Cardiology");
                doctor.setQualification("MBBS, MD");
                doctor.setImage("https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg");
                // Mongo will auto-generate ID, but if we really want a fixed ID for demo reference, we could set it.
                // For now, letting Mongo generate it is safer.
                
                User patient = new User();
                patient.setName("John Doe");
                patient.setEmail("patient@health.com");
                patient.setPassword("123");
                patient.setRole("patient");
                patient.setPhone("9876543210");
                patient.setImage("assets/images/patient_john.png");

                userRepo.saveAll(Arrays.asList(admin, doctor, patient));
            }

            // 2. Initialize Hospitals (Always clear and re-seed for demo consistency)
            System.out.println("Seeding Hospitals...");
            hospitalRepo.deleteAll(); // Clear old/partial data
            
            if (true) { // Logic block kept for structure
                List<Hospital> hospitals = new ArrayList<>();

                hospitals.add(createHospital("Satara Hospital & Research Center", "Radhika Road, Satara", 4.8, "assets/images/hospital_1.png", Arrays.asList("Cardiology", "Neurology", "General Surgery"), 200, 45, 8));
                hospitals.add(createHospital("Civil Hospital Satara", "Sadar Bazar, Satara", 4.2, "assets/images/hospital_2.png", Arrays.asList("Trauma", "Orthopedics", "Government Services"), 500, 120, 25));
                hospitals.add(createHospital("Drishti Eye Hospital", "Powai Naka, Satara", 4.9, "assets/images/hospital_3.png", Arrays.asList("Ophthalmology (Eye)", "Laser Surgery"), 30, 12, 2));
                hospitals.add(createHospital("Jeevanprakash ENT Hospital", "Kalyani Nagar, Satara", 4.7, "assets/images/hospital_1.png", Arrays.asList("ENT (Ear, Nose, Throat)"), 25, 8, 0));
                hospitals.add(createHospital("Yashashree Dental Clinic", "Rajpath, Satara", 4.9, "assets/images/hospital_2.png", Arrays.asList("Dental Surgery", "Orthodontics"), 5, 3, 0));
                hospitals.add(createHospital("Mangalmurti Hospital", "Powai Naka, Satara", 4.5, "assets/images/hospital_3.png", Arrays.asList("General Medicine", "Pediatrics"), 50, 15, 5));
                hospitals.add(createHospital("Sanjeevani Nursing Home", "Sadar Bazar, Satara", 4.3, "assets/images/hospital_1.png", Arrays.asList("Maternity", "Gynecology"), 30, 10, 2));
                hospitals.add(createHospital("Chavan Hospital", "Market Yard, Satara", 4.6, "assets/images/hospital_2.png", Arrays.asList("Orthopedics", "Trauma"), 80, 20, 10));
                hospitals.add(createHospital("City Care Hospital", "Rajwada, Satara", 4.4, "assets/images/hospital_3.png", Arrays.asList("General Surgery", "Urology"), 60, 18, 6));
                hospitals.add(createHospital("Prism Eye Clinic", "Powai Naka, Satara", 4.8, "assets/images/hospital_1.png", Arrays.asList("Ophthalmology"), 10, 5, 0));
                hospitals.add(createHospital("Lotus Multispeciality", "MIDC, Satara", 4.7, "assets/images/hospital_2.png", Arrays.asList("Cardiology", "Neurology"), 120, 40, 15));
                hospitals.add(createHospital("Sahyadri Referral Hospital", "Karad Road, Satara", 4.9, "assets/images/hospital_3.png", Arrays.asList("Oncology", "Radiology"), 150, 35, 20));
                hospitals.add(createHospital("Krushna Hospital", "Karad, Satara", 4.6, "assets/images/hospital_1.png", Arrays.asList("General Medicine"), 100, 25, 12));
                hospitals.add(createHospital("Dhanwantari Hospital", "Koregaon, Satara", 4.3, "assets/images/hospital_2.png", Arrays.asList("Pediatrics"), 40, 12, 4));
                hospitals.add(createHospital("Mauli Hospital", "Wai, Satara", 4.5, "assets/images/hospital_3.png", Arrays.asList("Gynecology"), 35, 8, 3));
                hospitals.add(createHospital("Geetamata Maternity Home", "Satara City", 4.4, "assets/images/hospital_1.png", Arrays.asList("Maternity"), 20, 5, 0));
                hospitals.add(createHospital("Apollo Spectra", "NH4, Satara", 4.9, "assets/images/hospital_2.png", Arrays.asList("Multispeciality"), 80, 30, 10));
                hospitals.add(createHospital("Ruby Hall Clinic (Satara)", "Powai Naka, Satara", 4.8, "assets/images/hospital_3.png", Arrays.asList("Cardiology", "Trauma"), 60, 15, 8));
                hospitals.add(createHospital("KEM Satara", "Camp, Satara", 4.5, "https://plus.unsplash.com/premium_photo-1673953510158-174d46c82736?auto=format&fit=crop&q=80&w=1000", Arrays.asList("Dermatology"), 45, 10, 2));
                hospitals.add(createHospital("Sassoon General (Satara)", "Civil Lines, Satara", 4.2, "assets/images/hospital_2.png", Arrays.asList("Government"), 200, 50, 20));
                hospitals.add(createHospital("Jehangir Hospital (Satara)", "Station Road, Satara", 4.7, "assets/images/hospital_3.png", Arrays.asList("Pediatrics"), 70, 22, 10));
                hospitals.add(createHospital("Inlaks Hospital", "Koregaon Park, Satara", 4.6, "assets/images/hospital_1.png", Arrays.asList("Oncology"), 90, 28, 12));
                hospitals.add(createHospital("Deenanath Mangeshkar Clinic", "City Center, Satara", 4.9, "assets/images/hospital_2.png", Arrays.asList("Super Speciality"), 100, 40, 18));
                hospitals.add(createHospital("Noble Hospital", "Hadapsar Road, Satara", 4.5, "assets/images/hospital_3.png", Arrays.asList("Cardiology"), 110, 35, 15));
                hospitals.add(createHospital("Hardikar Hospital", "Shivajinagar, Satara", 4.4, "assets/images/hospital_1.png", Arrays.asList("Orthopedics"), 55, 12, 5));

                hospitalRepo.saveAll(hospitals);
            }
            
            System.out.println("Database Seeding Completed!");
        };
    }
}
