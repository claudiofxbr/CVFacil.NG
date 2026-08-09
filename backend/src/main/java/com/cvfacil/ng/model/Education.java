package com.cvfacil.ng.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "cv_educations")
@NoArgsConstructor
@AllArgsConstructor
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    @JsonIgnoreProperties("educations")
    private Resume resume;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String institution;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String degree;

    @Column(name = "field_of_study", columnDefinition = "TEXT")
    private String fieldOfStudy;

    @Column(name = "start_date", columnDefinition = "TEXT")
    private String startDate;

    @Column(name = "end_date", columnDefinition = "TEXT")
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
