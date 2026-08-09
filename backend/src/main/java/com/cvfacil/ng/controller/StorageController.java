package com.cvfacil.ng.controller;

import com.cvfacil.ng.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.cvfacil.ng.model.User;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@RestController
@RequestMapping("/api/storage")
@Slf4j
public class StorageController {

    private final StorageService storageService;

    @Autowired
    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) String userId,
            @AuthenticationPrincipal User authenticatedUser) {
        try {
            // Segurança: endpoint exige autenticação (ver SecurityConfig). Usuário não-ADMIN
            // só pode enviar arquivos para o próprio diretório, independentemente do userId informado.
            boolean isAdmin = authenticatedUser.getRole() == com.cvfacil.ng.model.UserRole.ADMIN
                    || authenticatedUser.getRole() == com.cvfacil.ng.model.UserRole.ROOT;
            String targetUserId = (isAdmin && userId != null && !userId.isEmpty())
                    ? userId
                    : String.valueOf(authenticatedUser.getId());

            log.info("[STORAGE] Upload para usuário {}: {}", targetUserId, file.getOriginalFilename());
            String fileName = storageService.storeInClientDir(file, targetUserId);

            String fileDownloadUri = "/api/storage/files/" + fileName;
            
            return ResponseEntity.ok(Map.of(
                "fileName", fileName,
                "fileUrl", fileDownloadUri
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Falha ao fazer upload do arquivo: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/files/{clientDir}/{fileName}")
    public ResponseEntity<org.springframework.core.io.Resource> getFile(
            @PathVariable String clientDir,
            @PathVariable String fileName) {
        try {
            // Segurança: Sanitização básica contra Path Traversal
            if (clientDir.contains("..") || clientDir.contains("/") || clientDir.contains("\\") ||
                fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
                log.error("[SECURITY] Tentativa de Path Traversal detectada: {}/{}", clientDir, fileName);
                return ResponseEntity.status(403).build();
            }

            java.nio.file.Path file = storageService.load(clientDir + "/" + fileName);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("[STORAGE-ERROR] Erro ao carregar arquivo: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
