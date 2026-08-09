package com.cvfacil.ng.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HobbyDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
