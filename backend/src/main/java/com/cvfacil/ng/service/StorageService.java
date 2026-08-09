package com.cvfacil.ng.service;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    void init();
    String store(MultipartFile file);
    String storeInClientDir(MultipartFile file, String clientId);
    Path load(String filename);
    Path loadFromClientDir(String filename, String clientId);
    void deleteAll();
}
