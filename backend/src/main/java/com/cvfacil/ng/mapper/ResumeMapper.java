package com.cvfacil.ng.mapper;

import com.cvfacil.ng.dto.*;
import com.cvfacil.ng.model.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ResumeMapper {

    public ResumeDTO toDTO(Resume entity) {
        if (entity == null) return null;
        
        ResumeDTO dto = new ResumeDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setProfession(entity.getProfession());
        dto.setContactEmail(entity.getContactEmail());
        dto.setPhone(entity.getPhone());
        dto.setWebsite(entity.getWebsite());
        dto.setLinkedinUrl(entity.getLinkedinUrl());
        dto.setProfessionalQualifications(entity.getProfessionalQualifications());
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setLayoutId(entity.getLayoutId());
        dto.setFullName(entity.getFullName());
        dto.setPrimaryColor(entity.getPrimaryColor());
        dto.setSecondaryColor(entity.getSecondaryColor());
        dto.setBgColor(entity.getBgColor());
        dto.setTextColor(entity.getTextColor());
        dto.setTemplateStyle(entity.getTemplateStyle());
        dto.setFontFamily(entity.getFontFamily());
        dto.setFontSize(entity.getFontSize());
        dto.setLineHeight(entity.getLineHeight());
        dto.setSummary(entity.getSummary());
        dto.setPublic(entity.isPublic());
        dto.setPrimary(entity.isPrimary());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        if (entity.getExperiences() != null) {
            dto.setExperiences(entity.getExperiences().stream().map(this::toDTO).collect(Collectors.toList()));
        }
        if (entity.getEducations() != null) {
            dto.setEducations(entity.getEducations().stream().map(this::toDTO).collect(Collectors.toList()));
        }
        if (entity.getSkills() != null) {
            dto.setSkills(entity.getSkills().stream().map(this::toDTO).collect(Collectors.toList()));
        }
        if (entity.getLanguages() != null) {
            dto.setLanguages(entity.getLanguages().stream().map(this::toDTO).collect(Collectors.toList()));
        }
        if (entity.getHobbies() != null) {
            dto.setHobbies(entity.getHobbies().stream().map(this::toDTO).collect(Collectors.toList()));
        }
        
        return dto;
    }

    public ExperienceDTO toDTO(Experience entity) {
        if (entity == null) return null;
        ExperienceDTO dto = new ExperienceDTO();
        dto.setId(entity.getId());
        dto.setCompany(entity.getCompany());
        dto.setPosition(entity.getPosition());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setDescription(entity.getDescription());
        dto.setKnowledgePercentage(entity.getKnowledgePercentage());
        dto.setQualifications(entity.getQualifications());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public EducationDTO toDTO(Education entity) {
        if (entity == null) return null;
        EducationDTO dto = new EducationDTO();
        dto.setId(entity.getId());
        dto.setInstitution(entity.getInstitution());
        dto.setDegree(entity.getDegree());
        dto.setFieldOfStudy(entity.getFieldOfStudy());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public SkillDTO toDTO(Skill entity) {
        if (entity == null) return null;
        SkillDTO dto = new SkillDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPercentage(entity.getPercentage());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public LanguageDTO toDTO(Language entity) {
        if (entity == null) return null;
        LanguageDTO dto = new LanguageDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLevel(entity.getLevel());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public HobbyDTO toDTO(Hobby entity) {
        if (entity == null) return null;
        HobbyDTO dto = new HobbyDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public Resume toEntity(ResumeDTO dto) {
        if (dto == null) return null;
        Resume entity = new Resume();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(Resume entity, ResumeDTO dto) {
        if (dto == null) return;
        
        entity.setTitle(dto.getTitle());
        entity.setProfession(dto.getProfession());
        entity.setContactEmail(dto.getContactEmail());
        entity.setPhone(dto.getPhone());
        entity.setWebsite(dto.getWebsite());
        entity.setLinkedinUrl(dto.getLinkedinUrl());
        entity.setProfessionalQualifications(dto.getProfessionalQualifications());
        entity.setPhotoUrl(dto.getPhotoUrl());
        entity.setLayoutId(dto.getLayoutId());
        entity.setFullName(dto.getFullName());
        entity.setPrimaryColor(dto.getPrimaryColor());
        entity.setSecondaryColor(dto.getSecondaryColor());
        entity.setBgColor(dto.getBgColor());
        entity.setTextColor(dto.getTextColor());
        entity.setTemplateStyle(dto.getTemplateStyle());
        entity.setFontFamily(dto.getFontFamily());
        entity.setFontSize(dto.getFontSize());
        entity.setLineHeight(dto.getLineHeight());
        entity.setSummary(dto.getSummary());
        entity.setPublic(dto.isPublic());
        entity.setPrimary(dto.isPrimary());
        
        // As coleções serão tratadas no serviço para gerenciar o orphanRemoval corretamente
    }
}
