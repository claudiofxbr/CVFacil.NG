package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LanguageDTO {
    private Long id;
    private String name;
    private String level;
    private LocalDateTime createdAt;
}
