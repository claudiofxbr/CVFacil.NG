package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResumeDTO {
    private Long id;
    private String title;
    private String profession;
    private String contactEmail;
    private String phone;
    private String website;
    private String linkedinUrl;
    private String professionalQualifications;
    private String photoUrl;
    private String layoutId;
    private String fullName;
    private String primaryColor;
    private String secondaryColor;
    private String bgColor;
    private String textColor;
    private String templateStyle;
    private String fontFamily;
    private Integer fontSize;
    private Double lineHeight;
    private String summary;
    private boolean isPublic;
    private boolean primary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
    private List<SkillDTO> skills;
    private List<LanguageDTO> languages;
    private List<HobbyDTO> hobbies;
}
