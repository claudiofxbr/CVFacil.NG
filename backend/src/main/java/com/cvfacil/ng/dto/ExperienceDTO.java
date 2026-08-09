package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExperienceDTO {
    private Long id;
    private String company;
    private String position;
    private String startDate;
    private String endDate;
    private String description;
    private Integer knowledgePercentage;
    private String qualifications;
    private LocalDateTime createdAt;
}
