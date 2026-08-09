package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EducationDTO {
    private Long id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;
    private String description;
    private LocalDateTime createdAt;
}
