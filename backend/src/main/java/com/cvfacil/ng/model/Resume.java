package com.cvfacil.ng.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import org.hibernate.annotations.BatchSize;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.List;
import org.hibernate.annotations.Where;

@Getter
@Setter
@Entity
@Table(name = "cv_resumes")
@Where(clause = "deleted_at IS NULL")
@NoArgsConstructor
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("resumes")
    private User user;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String profession;

    @Column(name = "contact_email", columnDefinition = "TEXT")
    private String contactEmail;

    @Column(columnDefinition = "TEXT")
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String website;

    @Column(name = "linkedin_url", columnDefinition = "TEXT")
    private String linkedinUrl;

    @Column(name = "professional_qualifications", columnDefinition = "TEXT")
    private String professionalQualifications;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "layout_id")
    private String layoutId = "dark-blue";

    @Column(name = "full_name", columnDefinition = "TEXT")
    private String fullName;

    @Column(name = "primary_color")
    private String primaryColor = "#2563eb";

    @Column(name = "secondary_color")
    private String secondaryColor = "#1e40af";

    @Column(name = "bg_color")
    private String bgColor = "#ffffff";

    @Column(name = "text_color")
    private String textColor = "#333333";

    @Column(name = "template_style")
    private String templateStyle = "Corporativo";

    @Column(name = "font_family")
    private String fontFamily = "Inter";

    @Column(name = "font_size")
    private Integer fontSize = 12;

    @Column(name = "line_height", columnDefinition = "NUMERIC")
    private Double lineHeight = 1.5;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private boolean isPublic = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "is_primary")
    private boolean primary = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("resume")
    @BatchSize(size = 20)
    private Set<Experience> experiences = new LinkedHashSet<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("resume")
    @BatchSize(size = 20)
    private Set<Education> educations = new LinkedHashSet<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("resume")
    @BatchSize(size = 20)
    private Set<Skill> skills = new LinkedHashSet<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("resume")
    @BatchSize(size = 20)
    private Set<Language> languages = new LinkedHashSet<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("resume")
    @BatchSize(size = 20)
    private Set<Hobby> hobbies = new LinkedHashSet<>();
}
