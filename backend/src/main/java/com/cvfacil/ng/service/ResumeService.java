package com.cvfacil.ng.service;

import com.cvfacil.ng.dto.ResumeDTO;
import com.cvfacil.ng.mapper.ResumeMapper;
import com.cvfacil.ng.model.*;
import com.cvfacil.ng.model.User;
import com.cvfacil.ng.repository.ResumeRepository;
import com.cvfacil.ng.repository.UserRepository;
import com.cvfacil.ng.repository.projection.ResumeSummary;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeMapper resumeMapper;

    @Transactional(readOnly = true)
    public List<ResumeSummary> getAllResumes(String email) {
        User user = getUserByEmail(email);
        return resumeRepository.findAllSummariesByUser(user);
    }

    @Transactional(readOnly = true)
    public List<ResumeDTO> getTrashResumes(String email) {
        User user = getUserByEmail(email);
        // Nota: @Where filtra deletedAt IS NULL. Para ver a lixeira, precisaríamos de uma consulta nativa ou desativar o filtro.
        // Como o objetivo é performance no dashboard, manteremos a lixeira como está por enquanto ou corrigiremos o repositório.
        return resumeRepository.findByUserAndDeletedAtIsNotNull(user)
                .stream().map(resumeMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeDTO getResumeById(Long id, String email) {
        Resume resume = getResumeEntityById(id);
        validateReadAccess(resume, email);
        return resumeMapper.toDTO(resume);
    }

    @Transactional
    public ResumeDTO saveResume(ResumeDTO resumeDto, String email) {
        User user = getUserByEmail(email);
        log.info("[DB] Iniciando salvamento de currículo: {}", (resumeDto.getId() != null ? resumeDto.getId() : "Novo"));
        
        Resume resume;
        if (resumeDto.getId() != null) {
            resume = resumeRepository.findByIdFull(resumeDto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Currículo não encontrado: " + resumeDto.getId()));
            
            validateOwnership(resume, email);
            resumeMapper.updateEntity(resume, resumeDto);
            syncCollections(resume, resumeDto);
        } else {
            resume = resumeMapper.toEntity(resumeDto);
            resume.setUser(user);
            syncCollections(resume, resumeDto);
        }

        try {
            Resume saved = resumeRepository.saveAndFlush(resume);
            log.info("[DB] Sucesso ao persistir currículo ID: {}", saved.getId());
            return resumeMapper.toDTO(saved);
        } catch (Exception e) {
            log.error("[SRE] FALHA NA PERSISTÊNCIA: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional
    public void deleteResume(Long id, String email) {
        Resume resume = getResumeEntityWithOwner(id);
        validateOwnership(resume, email);
        
        if (resume.getDeletedAt() == null) {
            log.info("[DB-DELETE] Movendo para lixeira: {}", id);
            resume.setDeletedAt(LocalDateTime.now());
            resumeRepository.save(resume);
        } else {
            log.warn("[DB-DELETE] Currículo {} já está na lixeira.", id);
        }
    }

    @Transactional
    public void restoreResume(Long id, String email) {
        Resume resume = getResumeEntityWithOwner(id);
        validateOwnership(resume, email);
        resume.setDeletedAt(null);
        resumeRepository.save(resume);
    }

    @Transactional
    public void hardDeleteResume(Long id, String email) {
        Resume resume = getResumeEntityWithOwner(id);
        validateOwnership(resume, email);
        resumeRepository.delete(resume);
    }

    // Método leve apenas com o usuário proprietário (evita MultipleBagFetchException)
    @Transactional(readOnly = true)
    public Resume getResumeEntityWithOwner(Long id) {
        return resumeRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new EntityNotFoundException("Currículo não encontrado com ID: " + id));
    }

    // Método utilitário para o controller exportador
    @Transactional(readOnly = true)
    public Resume getResumeEntityById(Long id) {
        return resumeRepository.findByIdFull(id)
                .orElseThrow(() -> new EntityNotFoundException("Currículo não encontrado com ID: " + id));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + email));
    }

    private void validateReadAccess(Resume resume, String email) {
        if (!resume.isPublic() && (resume.getUser() == null || !resume.getUser().getEmail().equalsIgnoreCase(email))) {
            log.error("[SECURITY-READ] Acesso negado! Public: {}, User: {}, Owner: {}", 
                resume.isPublic(), email, (resume.getUser() != null ? resume.getUser().getEmail() : "NULL"));
            throw new org.springframework.security.access.AccessDeniedException("Você não tem permissão para visualizar este currículo.");
        }
    }

    private void validateOwnership(Resume resume, String email) {
        if (resume.getUser() == null || !resume.getUser().getEmail().equalsIgnoreCase(email)) {
            log.error("[SECURITY-WRITE] Tentativa de modificação não autorizada! User: {}, Owner: {}", 
                email, (resume.getUser() != null ? resume.getUser().getEmail() : "NULL"));
            throw new org.springframework.security.access.AccessDeniedException("Apenas o proprietário pode realizar esta operação.");
        }
    }

    private void prepareResumeCollections(Resume resume) {
        if (resume.getExperiences() != null) resume.getExperiences().forEach(e -> e.setResume(resume));
        if (resume.getEducations() != null) resume.getEducations().forEach(ed -> ed.setResume(resume));
        if (resume.getSkills() != null) resume.getSkills().forEach(s -> s.setResume(resume));
        if (resume.getLanguages() != null) resume.getLanguages().forEach(l -> l.setResume(resume));
        if (resume.getHobbies() != null) resume.getHobbies().forEach(h -> h.setResume(resume));
    }

    private void syncCollections(Resume existing, ResumeDTO incoming) {
        // Experiências
        existing.getExperiences().clear();
        if (incoming.getExperiences() != null) {
            incoming.getExperiences().forEach(dto -> {
                Experience model = new Experience();
                model.setCompany(dto.getCompany());
                model.setPosition(dto.getPosition());
                model.setStartDate(dto.getStartDate());
                model.setEndDate(dto.getEndDate());
                model.setDescription(dto.getDescription());
                model.setKnowledgePercentage(dto.getKnowledgePercentage());
                model.setQualifications(dto.getQualifications());
                model.setResume(existing);
                existing.getExperiences().add(model);
            });
        }
        syncOtherCollections(existing, incoming);
    }

    private void syncOtherCollections(Resume existing, ResumeDTO dto) {
        // Educations
        existing.getEducations().clear();
        if (dto.getEducations() != null) {
            dto.getEducations().forEach(d -> {
                Education m = new Education();
                m.setInstitution(d.getInstitution());
                m.setDegree(d.getDegree());
                m.setFieldOfStudy(d.getFieldOfStudy());
                m.setStartDate(d.getStartDate());
                m.setEndDate(d.getEndDate());
                m.setDescription(d.getDescription());
                m.setResume(existing);
                existing.getEducations().add(m);
            });
        }
        
        // Skills
        existing.getSkills().clear();
        if (dto.getSkills() != null) {
            dto.getSkills().forEach(d -> {
                Skill m = new Skill();
                m.setName(d.getName());
                m.setPercentage(d.getPercentage());
                m.setResume(existing);
                existing.getSkills().add(m);
            });
        }

        // Languages
        existing.getLanguages().clear();
        if (dto.getLanguages() != null) {
            dto.getLanguages().forEach(d -> {
                Language m = new Language();
                m.setName(d.getName());
                m.setLevel(d.getLevel());
                m.setResume(existing);
                existing.getLanguages().add(m);
            });
        }

        // Hobbies
        existing.getHobbies().clear();
        if (dto.getHobbies() != null) {
            dto.getHobbies().forEach(d -> {
                Hobby m = new Hobby();
                m.setName(d.getName());
                m.setResume(existing);
                existing.getHobbies().add(m);
            });
        }
    }
}

