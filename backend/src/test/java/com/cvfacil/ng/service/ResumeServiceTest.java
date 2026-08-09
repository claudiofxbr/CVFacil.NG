package com.cvfacil.ng.service;

import com.cvfacil.ng.dto.ResumeDTO;
import com.cvfacil.ng.mapper.ResumeMapper;
import com.cvfacil.ng.model.Resume;
import com.cvfacil.ng.model.User;
import com.cvfacil.ng.repository.ResumeRepository;
import com.cvfacil.ng.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ResumeMapper resumeMapper;

    @InjectMocks
    private ResumeService resumeService;

    private User testUser;
    private Resume testResume;
    private ResumeDTO testResumeDTO;
    private String testEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(testEmail);

        testResume = new Resume();
        testResume.setId(1L);
        testResume.setTitle("Software Engineer");
        testResume.setUser(testUser);

        testResumeDTO = new ResumeDTO();
        testResumeDTO.setId(1L);
        testResumeDTO.setTitle("Software Engineer");
    }

    @Test
    void saveResume_Success_New() {
        testResumeDTO.setId(null);
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(resumeMapper.toEntity(any(ResumeDTO.class))).thenReturn(testResume);
        when(resumeRepository.saveAndFlush(any(Resume.class))).thenReturn(testResume);
        when(resumeMapper.toDTO(any(Resume.class))).thenReturn(testResumeDTO);

        ResumeDTO saved = resumeService.saveResume(testResumeDTO, testEmail);

        assertNotNull(saved);
        assertEquals("Software Engineer", saved.getTitle());
        verify(resumeRepository, times(1)).saveAndFlush(any(Resume.class));
    }

    @Test
    void saveResume_Fail_NoUser() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            resumeService.saveResume(testResumeDTO, testEmail);
        });
    }

    @Test
    void getResumeById_Success() {
        when(resumeRepository.findByIdFull(1L)).thenReturn(Optional.of(testResume));
        when(resumeMapper.toDTO(testResume)).thenReturn(testResumeDTO);

        ResumeDTO found = resumeService.getResumeById(1L, testEmail);

        assertNotNull(found);
        assertEquals(testResumeDTO.getTitle(), found.getTitle());
    }

    @Test
    void getResumeById_Fail_NotFound() {
        when(resumeRepository.findByIdFull(1L)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class, () -> {
            resumeService.getResumeById(1L, testEmail);
        });
    }

    @Test
    void deleteResume_Success() {
        when(resumeRepository.findByIdWithOwner(1L)).thenReturn(Optional.of(testResume));
        
        resumeService.deleteResume(1L, testEmail);
        
        assertNotNull(testResume.getDeletedAt());
        verify(resumeRepository, times(1)).save(testResume);
    }

    @Test
    void deleteResume_Fail_Unauthorized() {
        when(resumeRepository.findByIdWithOwner(1L)).thenReturn(Optional.of(testResume));
        
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            resumeService.deleteResume(1L, "wrong@example.com");
        });
    }
}
