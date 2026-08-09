package com.cvfacil.ng.service;

import com.cvfacil.ng.model.Resume;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.net.InetAddress;
import java.net.URI;
import java.net.URL;

@Slf4j
@Service
public class PdfExportService {

    public byte[] generateResumePdf(Resume resume) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Configuração de Cores
            Color primaryColor = parseColor(resume.getPrimaryColor(), new Color(37, 99, 235)); // Default Blue
            Color secondaryColor = parseColor(resume.getSecondaryColor(), new Color(30, 64, 175));
            Color textColor = parseColor(resume.getTextColor(), new Color(51, 51, 51));

            // Fontes
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, primaryColor);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, secondaryColor);
            Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, primaryColor);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11, textColor);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, textColor);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY);

            // --- CABEÇALHO ---
            PdfPTable headerTable = new PdfPTable(new float[]{3, 1});
            headerTable.setWidthPercentage(100);

            // Nome e Profissão
            PdfPCell infoCell = new PdfPCell();
            infoCell.setBorder(Rectangle.NO_BORDER);
            infoCell.addElement(new Paragraph(resume.getFullName() != null ? resume.getFullName().toUpperCase() : "NOME NÃO INFORMADO", titleFont));
            infoCell.addElement(new Paragraph(resume.getProfession() != null ? resume.getProfession() : "", subtitleFont));
            headerTable.addCell(infoCell);

            // Foto (Placeholder ou real se disponível)
            PdfPCell photoCell = new PdfPCell();
            photoCell.setBorder(Rectangle.NO_BORDER);
            photoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            if (isSafePhotoUrl(resume.getPhotoUrl())) {
                try {
                    Image img = Image.getInstance(new URL(resume.getPhotoUrl()));
                    img.scaleToFit(80, 80);
                    photoCell.addElement(img);
                } catch (Exception e) {
                    log.warn("[PDF] Falha ao carregar imagem: {}", e.getMessage());
                }
            }
            headerTable.addCell(photoCell);
            document.add(headerTable);

            // --- CONTATOS ---
            document.add(new Paragraph("\n"));
            Paragraph contacts = new Paragraph();
            contacts.setFont(smallFont);
            if (resume.getContactEmail() != null) contacts.add(resume.getContactEmail() + "  |  ");
            if (resume.getPhone() != null) contacts.add(resume.getPhone() + "  |  ");
            if (resume.getLinkedinUrl() != null) contacts.add("LinkedIn  |  ");
            if (resume.getWebsite() != null) contacts.add(resume.getWebsite());
            contacts.setAlignment(Element.ALIGN_LEFT);
            document.add(contacts);

            addSeparator(document, primaryColor);

            // --- RESUMO PROFISSIONAL ---
            if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
                addSectionTitle(document, "RESUMO PROFISSIONAL", sectionHeaderFont);
                Paragraph summary = new Paragraph(resume.getSummary(), normalFont);
                summary.setSpacingAfter(15);
                summary.setAlignment(Element.ALIGN_JUSTIFIED);
                document.add(summary);
            }

            // --- EXPERIÊNCIAS ---
            if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
                addSectionTitle(document, "EXPERIÊNCIA PROFISSIONAL", sectionHeaderFont);
                resume.getExperiences().forEach(exp -> {
                    try {
                        Paragraph p1 = new Paragraph(exp.getPosition(), boldFont);
                        Paragraph p2 = new Paragraph(exp.getCompany() + " | " + exp.getStartDate() + " - " + (exp.getEndDate() != null ? exp.getEndDate() : "Presente"), smallFont);
                        Paragraph p3 = new Paragraph(exp.getDescription(), normalFont);
                        p3.setSpacingAfter(10);
                        document.add(p1);
                        document.add(p2);
                        document.add(p3);
                    } catch (DocumentException e) {
                        log.error("[PDF] Erro ao adicionar experiência");
                    }
                });
            }

            // --- FORMAÇÃO ---
            if (resume.getEducations() != null && !resume.getEducations().isEmpty()) {
                addSectionTitle(document, "FORMAÇÃO ACADÊMICA", sectionHeaderFont);
                resume.getEducations().forEach(edu -> {
                    try {
                        Paragraph p1 = new Paragraph(edu.getDegree(), boldFont);
                        Paragraph p2 = new Paragraph(edu.getInstitution() + " | " + edu.getEndDate(), smallFont);
                        p2.setSpacingAfter(8);
                        document.add(p1);
                        document.add(p2);
                    } catch (DocumentException e) {
                        log.error("[PDF] Erro ao adicionar formação");
                    }
                });
            }

            // --- COMPETÊNCIAS ---
            if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
                addSectionTitle(document, "COMPETÊNCIAS", sectionHeaderFont);
                com.lowagie.text.List skillList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
                skillList.setListSymbol("• ");
                resume.getSkills().forEach(s -> skillList.add(new ListItem(s.getName() + (s.getPercentage() != null ? " (" + s.getPercentage() + "%)" : ""), normalFont)));
                document.add(skillList);
            }

            document.close();
            log.info("[PDF-SUCCESS] PDF gerado para ID: {}", resume.getId());
        } catch (Exception e) {
            log.error("[PDF-ERROR] Falha crítica na geração do PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Falha ao gerar PDF");
        }

        return out.toByteArray();
    }

    private void addSectionTitle(Document doc, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(10);
        p.setSpacingAfter(5);
        doc.add(p);
    }

    private void addSeparator(Document doc, Color color) throws DocumentException {
        LineSeparator ls = new LineSeparator();
        ls.setLineColor(color);
        ls.setOffset(-2);
        doc.add(new Chunk(ls));
        doc.add(new Paragraph("\n"));
    }

    private Color parseColor(String hex, Color defaultColor) {
        if (hex == null || hex.isEmpty()) return defaultColor;
        try {
            return Color.decode(hex);
        } catch (Exception e) {
            return defaultColor;
        }
    }

    /**
     * Evita SSRF: só permite embutir a foto no PDF se for um data URI (embutido, sem rede)
     * ou um caminho servido pelo próprio storage da aplicação. Bloqueia URLs http(s) externas
     * arbitrárias, que fariam o servidor requisitar hosts controlados pelo usuário.
     */
    private boolean isSafePhotoUrl(String photoUrl) {
        if (photoUrl == null || photoUrl.isEmpty()) {
            return false;
        }
        if (photoUrl.startsWith("data:image/")) {
            return true;
        }
        try {
            URI uri = URI.create(photoUrl);
            String host = uri.getHost();
            if (host == null) {
                return false;
            }
            InetAddress addr = InetAddress.getByName(host);
            return !addr.isLoopbackAddress() && !addr.isSiteLocalAddress()
                    && !addr.isLinkLocalAddress() && !addr.isAnyLocalAddress();
        } catch (Exception e) {
            return false;
        }
    }
}
