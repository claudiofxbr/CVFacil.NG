package com.cvfacil.ng.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.error("[DB-ERROR] Violação de integridade: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.CONFLICT, "Erro de consistência de dados: Conflito de integridade no banco.", null);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex) {
        log.warn("[NOT-FOUND] Recurso não encontrado: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        log.error("[AUTH-ERROR] Acesso negado: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acesso Negado: Você não tem permissão para esta operação.", null);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.", null);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
            
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Erro de validação nos dados enviados.", errors);
    }

    @ExceptionHandler(org.springframework.transaction.TransactionSystemException.class)
    public ResponseEntity<Map<String, Object>> handleTransactionException(org.springframework.transaction.TransactionSystemException ex) {
        log.error("[TX-ERROR] Erro de transação: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro de transação no banco de dados. Operação cancelada.", ex.getRootCause() != null ? ex.getRootCause().getMessage() : null);
    }

    @ExceptionHandler(jakarta.persistence.PersistenceException.class)
    public ResponseEntity<Map<String, Object>> handlePersistenceException(jakarta.persistence.PersistenceException ex) {
        log.error("[JPA-ERROR] Erro de persistência: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar persistência de dados no servidor.", null);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        log.error("[RUNTIME-ERROR] Erro inesperado: {}", ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro inesperado no processamento.", null);
    }

    @ExceptionHandler(ResumeImportException.class)
    public ResponseEntity<Map<String, Object>> handleResumeImportException(ResumeImportException ex) {
        log.error("[IMPORT-ERROR] ErrorCode: {} | UserMessage: {} | Technical: {}", 
            ex.getErrorCode(), ex.getUserFriendlyMessage(), ex.getMessage());
            
        return buildErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, ex.getUserFriendlyMessage(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        log.error("[FATAL-ERROR] Erro crítico no servidor: {}", ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno no servidor", null);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message, Object details) {
        String traceId = UUID.randomUUID().toString().substring(0, 8);
        
        if (status.is5xxServerError()) {
            log.error("[TRACE-ID: {}] ERRO CRÍTICO: {} - Status: {}", traceId, message, status.value());
        } else {
            log.info("[TRACE-ID: {}] Alerta Cliente: {} - Status: {}", traceId, message, status.value());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("traceId", traceId);
        if (details != null) {
            body.put("details", details);
        }
        return new ResponseEntity<>(body, status);
    }
}

