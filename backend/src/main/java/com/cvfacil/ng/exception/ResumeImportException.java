package com.cvfacil.ng.exception;

import lombok.Getter;

/**
 * Exceção customizada para falhas no processo de importação de currículos via IA ou Heurística.
 */
@Getter
public class ResumeImportException extends RuntimeException {
    
    private final String errorCode;
    private final String userFriendlyMessage;

    public ResumeImportException(String errorCode, String userFriendlyMessage, String technicalMessage) {
        super(technicalMessage);
        this.errorCode = errorCode;
        this.userFriendlyMessage = userFriendlyMessage;
    }

    public ResumeImportException(String errorCode, String userFriendlyMessage, String technicalMessage, Throwable cause) {
        super(technicalMessage, cause);
        this.errorCode = errorCode;
        this.userFriendlyMessage = userFriendlyMessage;
    }
}
