package com.cvfacil.ng.repository.projection;

import java.time.LocalDateTime;

public interface ResumeSummary {
    Long getId();
    String getTitle();
    String getFullName();
    String getProfession();
    String getLayoutId();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    boolean isPrimary();
}
