package com.cvfacil.ng.service;

import com.cvfacil.ng.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.cvfacil.ng.exception.ResumeImportException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;

/**
 * AI-Powered Resume Extraction Service.
 * Specialized in Vision-based PDF processing and Structured Data Mapping.
 * 
 * @author Antigravity AI Engineer
 */
@Slf4j
@Service
public class AiExtractionService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private static final String DEFAULT_LAYOUT = "modern_tech";

    /**
     * Extracts structured resume data from a PDF file.
     * Implements a robust fail-safe mechanism.
     */
    public ResumeDTO extractResumeFromPdf(MultipartFile file) {
        validateInput(file);
        
        // 1. Primary Strategy: Gemini Multimodal (Vision + Text)
        if (isAiConfigured()) {
            try {
                return processWithGeminiMultimodal(file);
            } catch (Exception e) {
                log.error("[AI-EXTRACTION] Gemini Multimodal Failure: {}. Attempting Text-Only AI Extraction...", e.getMessage());
                try {
                    return processWithGeminiTextOnly(file);
                } catch (Exception ex) {
                    log.error("[AI-EXTRACTION] Gemini Text-Only Failure: {}. Falling back to local heuristics.", ex.getMessage());
                }
            }
        } else {
            log.warn("[AI-EXTRACTION] Gemini API Key is missing or invalid. Check environment variables.");
        }

        // 2. Fallback Strategy: Local PDF Parsing + Heuristic Regex
        return processWithLocalHeuristics(file);
    }

    private void validateInput(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResumeImportException("EMPTY_FILE", "O arquivo está vazio. Por favor, selecione um PDF válido.", "MultipartFile is null or empty");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new ResumeImportException("INVALID_TYPE", "Apenas documentos PDF são aceitos para importação.", "ContentType is " + file.getContentType());
        }
        if (file.getSize() > 15 * 1024 * 1024) { // 15MB Safety limit
            throw new ResumeImportException("FILE_TOO_LARGE", "O arquivo excede o limite de 15MB. Tente um arquivo menor.", "File size: " + file.getSize());
        }
    }

    private boolean isAiConfigured() {
        return geminiApiKey != null && !geminiApiKey.trim().isEmpty() && !geminiApiKey.equals("YOUR_API_KEY");
    }

    private ResumeDTO processWithGeminiMultimodal(MultipartFile file) throws Exception {
        int maxRetries = 3;
        int attempt = 0;
        Exception lastException = null;

        while (attempt < maxRetries) {
            try {
                return executeGeminiCall(file);
            } catch (Exception e) {
                attempt++;
                lastException = e;
                log.warn("[AI-EXTRACTION] Attempt {}/{} failed: {}. Retrying in {}ms...", 
                    attempt, maxRetries, e.getMessage(), attempt * 1000);
                Thread.sleep(attempt * 1000L);
            }
        }
        
        log.error("[AI-EXTRACTION] All {} attempts failed. Re-throwing exception.", maxRetries);
        throw lastException;
    }

    private ResumeDTO executeGeminiCall(MultipartFile file) throws Exception {
        long startTime = System.currentTimeMillis();
        log.info("[AI-EXTRACTION] Calling Gemini 1.5 Flash (Multimodal) for: {}", file.getOriginalFilename());
        
        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
        String base64Pdf = Base64.getEncoder().encodeToString(file.getBytes());
        
        return callGemini(url, base64Pdf, true);
    }

    private ResumeDTO processWithGeminiTextOnly(MultipartFile file) throws Exception {
        log.info("[AI-EXTRACTION] Starting Text-Only AI Extraction...");
        String text = extractTextLocally(file);
        
        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
        return callGemini(url, text, false);
    }

    private ResumeDTO callGemini(String url, String content, boolean isBinary) throws Exception {
        String prompt = "Você é um especialista em recrutamento. Extraia os dados deste currículo para o formato JSON solicitado. " +
            "Seja preciso e preserve a fidelidade das informações. Se um campo não for encontrado, deixe-o nulo ou vazio. " +
            "Trate layouts complexos e converta datas para o formato AAAA-MM-DD. " +
            "Responda APENAS com o JSON, sem markdown.";

        com.fasterxml.jackson.databind.node.ObjectNode requestBody = objectMapper.createObjectNode();
        com.fasterxml.jackson.databind.node.ArrayNode contents = requestBody.putArray("contents");
        com.fasterxml.jackson.databind.node.ObjectNode contentObj = contents.addObject();
        com.fasterxml.jackson.databind.node.ArrayNode parts = contentObj.putArray("parts");
        
        parts.addObject().put("text", prompt);
        
        if (isBinary) {
            com.fasterxml.jackson.databind.node.ObjectNode inlineData = parts.addObject().putObject("inline_data");
            inlineData.put("mime_type", "application/pdf");
            inlineData.put("data", content);
        } else {
            parts.addObject().put("text", "CONTEÚDO DO CURRÍCULO:\n" + content);
        }
        
        String schemaJson = "{\"type\":\"OBJECT\",\"properties\":{\"fullName\":{\"type\":\"STRING\"},\"profession\":{\"type\":\"STRING\"},\"contactEmail\":{\"type\":\"STRING\"},\"phone\":{\"type\":\"STRING\"},\"website\":{\"type\":\"STRING\"},\"linkedinUrl\":{\"type\":\"STRING\"},\"summary\":{\"type\":\"STRING\"},\"professionalQualifications\":{\"type\":\"STRING\"},\"experiences\":{\"type\":\"ARRAY\",\"items\":{\"type\":\"OBJECT\",\"properties\":{\"company\":{\"type\":\"STRING\"},\"position\":{\"type\":\"STRING\"},\"description\":{\"type\":\"STRING\"},\"startDate\":{\"type\":\"STRING\"},\"endDate\":{\"type\":\"STRING\"},\"qualifications\":{\"type\":\"STRING\"},\"knowledgePercentage\":{\"type\":\"INTEGER\"}}}},\"educations\":{\"type\":\"ARRAY\",\"items\":{\"type\":\"OBJECT\",\"properties\":{\"institution\":{\"type\":\"STRING\"},\"degree\":{\"type\":\"STRING\"},\"fieldOfStudy\":{\"type\":\"STRING\"},\"startDate\":{\"type\":\"STRING\"},\"endDate\":{\"type\":\"STRING\"}}}},\"skills\":{\"type\":\"ARRAY\",\"items\":{\"type\":\"OBJECT\",\"properties\":{\"name\":{\"type\":\"STRING\"},\"percentage\":{\"type\":\"INTEGER\"}}}},\"languages\":{\"type\":\"ARRAY\",\"items\":{\"type\":\"OBJECT\",\"properties\":{\"name\":{\"type\":\"STRING\"},\"level\":{\"type\":\"STRING\"}}}},\"hobbies\":{\"type\":\"ARRAY\",\"items\":{\"type\":\"OBJECT\",\"properties\":{\"name\":{\"type\":\"STRING\"}}}}}}";
        
        com.fasterxml.jackson.databind.node.ObjectNode config = requestBody.putObject("generationConfig");
        config.put("response_mime_type", "application/json");
        config.set("response_schema", objectMapper.readTree(schemaJson));
        config.put("temperature", 0.1); 

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            log.error("[AI-EXTRACTION] Gemini API Error Response: {}", response.getBody());
            throw new RuntimeException("API Response error: " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody());
        String rawResponse = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        
        if (rawResponse == null || rawResponse.trim().isEmpty()) {
            throw new RuntimeException("Empty text in Gemini response");
        }

        String cleanJson = extractJsonContent(rawResponse);
        ResumeDTO dto = objectMapper.readValue(cleanJson, ResumeDTO.class);
        
        sanitizeDto(dto);
        dto.setLayoutId(DEFAULT_LAYOUT);
        dto.setTitle("Importado via IA - " + (dto.getFullName() != null ? dto.getFullName() : "Candidato"));
        
        return dto;
    }

    private String extractTextLocally(MultipartFile file) {
        try (InputStream is = file.getInputStream(); PDDocument doc = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(doc);
        } catch (Exception e) {
            log.error("[AI-EXTRACTION] Local PDF Extraction Error: ", e);
            return "";
        }
    }


    private void sanitizeDto(ResumeDTO dto) {
        // Normalize basic info
        dto.setFullName(normalizeString(dto.getFullName(), "Candidato"));
        dto.setProfession(normalizeString(dto.getProfession(), "Profissional"));
        dto.setContactEmail(normalizeString(dto.getContactEmail(), "contato@exemplo.com"));
        dto.setPhone(normalizeString(dto.getPhone(), ""));
        dto.setSummary(normalizeString(dto.getSummary(), "Resumo profissional extraído do documento."));

        // Sanitize Experiences
        if (dto.getExperiences() != null) {
            dto.getExperiences().removeIf(e -> e == null);
            dto.getExperiences().forEach(e -> {
                e.setCompany(normalizeString(e.getCompany(), "Empresa"));
                e.setPosition(normalizeString(e.getPosition(), "Cargo"));
                e.setDescription(normalizeString(e.getDescription(), "Descrição das atividades."));
                e.setQualifications(normalizeString(e.getQualifications(), "Qualificações não informadas."));
                if (e.getKnowledgePercentage() == null || e.getKnowledgePercentage() < 0) e.setKnowledgePercentage(0);
                if (e.getKnowledgePercentage() > 100) e.setKnowledgePercentage(100);
            });
        } else {
            dto.setExperiences(new ArrayList<>());
        }

        // Sanitize Educations
        if (dto.getEducations() != null) {
            dto.getEducations().removeIf(e -> e == null);
            dto.getEducations().forEach(e -> {
                e.setInstitution(normalizeString(e.getInstitution(), "Instituição"));
                e.setDegree(normalizeString(e.getDegree(), "Grau Acadêmico"));
                e.setFieldOfStudy(normalizeString(e.getFieldOfStudy(), "Área de Estudo"));
            });
        } else {
            dto.setEducations(new ArrayList<>());
        }

        // Sanitize Skills
        if (dto.getSkills() != null) {
            dto.getSkills().removeIf(s -> s == null || s.getName() == null);
            dto.getSkills().forEach(s -> {
                s.setName(normalizeString(s.getName(), "Habilidade"));
                if (s.getPercentage() == null || s.getPercentage() < 0) s.setPercentage(0);
                if (s.getPercentage() > 100) s.setPercentage(100);
            });
        } else {
            dto.setSkills(new ArrayList<>());
        }
    }

    private String normalizeString(String input, String defaultValue) {
        if (input == null || input.trim().isEmpty()) {
            return defaultValue;
        }
        // Remove excessive whitespace and line breaks within fields
        return input.trim().replaceAll("\\s+", " ");
    }

    private String extractJsonContent(String raw) {
        if (raw == null) return "{}";
        // Handle potential markdown blocks
        if (raw.contains("```json")) {
            raw = raw.substring(raw.indexOf("```json") + 7);
            if (raw.contains("```")) {
                raw = raw.substring(0, raw.lastIndexOf("```"));
            }
        } else if (raw.contains("```")) {
             raw = raw.substring(raw.indexOf("```") + 3);
             if (raw.contains("```")) {
                 raw = raw.substring(0, raw.lastIndexOf("```"));
             }
        }
        return raw.trim();
    }

    private ResumeDTO processWithLocalHeuristics(MultipartFile file) {
        log.info("[AI-EXTRACTION] Falling back to local heuristic processing...");
        String text = "";
        
        try (InputStream is = file.getInputStream(); PDDocument doc = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            text = stripper.getText(doc);
        } catch (Exception e) {
            log.error("[AI-EXTRACTION] Local PDF Error: ", e);
            throw new ResumeImportException("PDF_CORRUPT", "Não foi possível ler o arquivo PDF. Ele pode estar protegido por senha ou corrompido.", e.getMessage(), e);
        }

        if (text == null || text.trim().length() < 10) {
            throw new ResumeImportException("SCANNED_PDF_NO_IA", 
                "Este currículo parece ser uma imagem digitalizada e o serviço de IA está temporariamente indisponível. Por favor, tente um PDF com camada de texto ou aguarde alguns minutos.", 
                "Scanned PDF detected but Gemini fallback failed.");
        }

        return parseByRegex(text);
    }

    private ResumeDTO parseByRegex(String text) {
        ResumeDTO dto = new ResumeDTO();
        dto.setLayoutId(DEFAULT_LAYOUT);
        dto.setExperiences(new ArrayList<>());
        dto.setEducations(new ArrayList<>());
        dto.setSkills(new ArrayList<>());
        dto.setLanguages(new ArrayList<>());
        dto.setHobbies(new ArrayList<>());
        
        String[] lines = text.split("\\r?\\n");
        String candidateName = "Candidato";
        if (lines.length > 0) {
            candidateName = lines[0].trim();
            dto.setFullName(candidateName);
        }

        dto.setTitle("Importado (Heurística) - " + candidateName);

        // Simple Extractors
        Matcher emailM = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}").matcher(text);
        if (emailM.find()) dto.setContactEmail(emailM.group());

        Matcher phoneM = Pattern.compile("(\\d{2,3})?(\\s|-)?\\d{4,5}(\\s|-)?\\d{4}").matcher(text);
        if (phoneM.find()) dto.setPhone(phoneM.group());

        dto.setSummary("Extração parcial via heurística local. Por favor, revise os dados.");
        
        return dto;
    }
}
