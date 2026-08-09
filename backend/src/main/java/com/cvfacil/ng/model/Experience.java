package com.cvfacil.ng.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "cv_experiences")
@NoArgsConstructor
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    @JsonIgnoreProperties("experiences")
    private Resume resume;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String company;

    @NotBlank
    @Column(name = "job_position", columnDefinition = "TEXT")
    private String position;

    @Column(name = "start_date", columnDefinition = "TEXT")
    private String startDate;

    @Column(name = "end_date", columnDefinition = "TEXT")
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "knowledge_percentage")
    private Integer knowledgePercentage = 0;

    @Column(columnDefinition = "TEXT")
    private String qualifications;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
