package com.cvfacil.ng.controller;

import com.cvfacil.ng.dto.ResumeDTO;
import com.cvfacil.ng.mapper.ResumeMapper;
import com.cvfacil.ng.model.Resume;
import com.cvfacil.ng.repository.projection.ResumeSummary;
import com.cvfacil.ng.service.PdfExportService;
import com.cvfacil.ng.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final PdfExportService pdfExportService;
    private final ResumeMapper resumeMapper;
    private final com.cvfacil.ng.service.AiExtractionService aiExtractionService;

    @GetMapping
    public List<ResumeSummary> getMyResumes(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("[API] Buscando currículos para: {}", userDetails.getUsername());
        return resumeService.getAllResumes(userDetails.getUsername());
    }

    @PostMapping
    public ResponseEntity<ResumeDTO> createResume(@Valid @RequestBody ResumeDTO resumeDTO, @AuthenticationPrincipal UserDetails userDetails) {
        log.info("[RESUME-CREATE] Iniciando criação de currículo para: {}", userDetails.getUsername());
        ResumeDTO saved = resumeService.saveResume(resumeDTO, userDetails.getUsername());
        log.info("[RESUME-SUCCESS] Currículo ID {} criado com sucesso.", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeDTO> updateResume(@AuthenticationPrincipal UserDetails userDetails, 
                                                @PathVariable Long id, 
                                                @Valid @RequestBody ResumeDTO resumeDTO) {
        log.info("[RESUME-UPDATE] Atualizando currículo ID: {}", id);
        resumeDTO.setId(id);
        ResumeDTO updated = resumeService.saveResume(resumeDTO, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDTO> getResumeById(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        log.info("[RESUME-GET] Buscando currículo ID: {}", id);
        ResumeDTO resumeDTO = resumeService.getResumeById(id, userDetails.getUsername());
        return ResponseEntity.ok(resumeDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        log.info("[RESUME-DELETE] Movendo currículo para lixeira ID: {}", id);
        resumeService.deleteResume(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    public List<ResumeDTO> getTrash(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("[RESUME-TRASH] Buscando lixeira para: {}", userDetails.getUsername());
        return resumeService.getTrashResumes(userDetails.getUsername());
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        log.info("[RESUME-RESTORE] Restaurando currículo ID: {}", id);
        resumeService.restoreResume(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDelete(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        log.info("[RESUME-HARD-DELETE] Excluindo permanentemente currículo ID: {}", id);
        resumeService.hardDeleteResume(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportToPdf(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        log.info("[RESUME-EXPORT] Exportando para PDF currículo ID: {}", id);
        ResumeDTO resumeDTO = resumeService.getResumeById(id, userDetails.getUsername());
        
        // Convertemos para entidade apenas para o serviço de exportação (ou refatoramos o serviço)
        // Por enquanto, usamos o mapper para garantir compatibilidade com o PdfExportService existente
        Resume resumeEntity = resumeMapper.toEntity(resumeDTO);
        
        byte[] pdfBytes = pdfExportService.generateResumePdf(resumeEntity);
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=Curriculo_" + id + ".pdf")
                .body(pdfBytes);
    }

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<ResumeDTO> importResume(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("[RESUME-IMPORT] Recebido arquivo PDF para importação: {}", file.getOriginalFilename());
        
        ResumeDTO extractedDto = aiExtractionService.extractResumeFromPdf(file);
        
        log.info("[RESUME-IMPORT] AI Extraction concluída. Mockando e salvando novo currículo para {}", userDetails.getUsername());
        ResumeDTO saved = resumeService.saveResume(extractedDto, userDetails.getUsername());
        
        return ResponseEntity.ok(saved);
    }
}


