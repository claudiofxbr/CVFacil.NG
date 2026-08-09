package com.cvfacil.ng.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "cv_skills")
@NoArgsConstructor
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    @JsonIgnoreProperties("skills")
    private Resume resume;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    private Integer percentage = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
