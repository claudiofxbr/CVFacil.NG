package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SkillDTO {
    private Long id;
    private String name;
    private Integer percentage;
    private LocalDateTime createdAt;
}
