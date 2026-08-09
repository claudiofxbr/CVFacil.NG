package com.cvfacil.ng.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService implements StorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp");

    private final Path rootLocation;

    public FileStorageService(@Value("${storage.location:./uploads/photos}") String storageLocation) {
        this.rootLocation = Paths.get(storageLocation);
    }

    @Override
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
            log.info("[STORAGE] Diretório inicializado em: {}", rootLocation.toAbsolutePath());
        } catch (IOException e) {
            log.error("[STORAGE-ERROR] Falha crítica ao criar diretório: {}", e.getMessage());
            throw new RuntimeException("Não foi possível inicializar o diretório de armazenamento!", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        return storeInClientDir(file, "common");
    }

    @Override
    public String storeInClientDir(MultipartFile file, String clientId) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (file.isEmpty()) {
                log.error("[STORAGE-ERROR] Tentativa de salvar arquivo vazio: {}", originalFileName);
                throw new RuntimeException("Falha ao armazenar arquivo vazio " + originalFileName);
            }

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
                log.warn("[STORAGE-SECURITY] Tipo de arquivo rejeitado: {} ({})", originalFileName, contentType);
                throw new RuntimeException("Tipo de arquivo não permitido. Envie uma imagem JPEG, PNG ou WEBP.");
            }

            try {
                if (javax.imageio.ImageIO.read(file.getInputStream()) == null) {
                    log.warn("[STORAGE-SECURITY] Arquivo não é uma imagem decodificável: {}", originalFileName);
                    throw new RuntimeException("O arquivo enviado não é uma imagem válida.");
                }
            } catch (IOException e) {
                throw new RuntimeException("Não foi possível validar a imagem enviada.", e);
            }

            // Subdiretório do cliente
            Path clientLocation = this.rootLocation.resolve("client_" + clientId);
            if (!Files.exists(clientLocation)) {
                Files.createDirectories(clientLocation);
                log.info("[STORAGE] Novo subdiretório criado para cliente: {}", clientId);
            }

            // Gerar nome único para evitar colisões
            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }
            String fileName = UUID.randomUUID().toString() + extension;

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, clientLocation.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);
            }
            
            log.info("[STORAGE-SUCCESS] Arquivo salvo: client_{}/{}", clientId, fileName);
            return "client_" + clientId + "/" + fileName;
        } catch (IOException e) {
            log.error("[STORAGE-FATAL] Erro de I/O ao salvar {}: {}", originalFileName, e.getMessage());
            throw new RuntimeException("Falha ao armazenar o arquivo " + originalFileName, e);
        }
    }

    @Override
    public Path load(String filename) {
        Path filePath = rootLocation.resolve(filename).normalize();
        if (!filePath.startsWith(rootLocation.normalize())) {
            log.error("[SECURITY] Tentativa de Path Traversal bloqueada: {}", filename);
            throw new RuntimeException("Tentativa de acesso fora do diretório permitido!");
        }
        return filePath;
    }

    @Override
    public Path loadFromClientDir(String filename, String clientId) {
        Path clientLocation = rootLocation.resolve("client_" + clientId).normalize();
        Path filePath = clientLocation.resolve(filename).normalize();
        if (!filePath.startsWith(clientLocation)) {
            log.error("[SECURITY] Tentativa de Path Traversal por cliente {} bloqueada: {}", clientId, filename);
            throw new RuntimeException("Tentativa de acesso fora do diretório do cliente!");
        }
        return filePath;
    }

    @Override
    public void deleteAll() {
        // Implementar se necessário para manutenção
    }
}
