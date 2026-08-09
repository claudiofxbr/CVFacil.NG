from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def create_resume(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 50, "CARLOS SILVA")
    
    c.setFont("Helvetica", 14)
    c.drawString(50, height - 70, "Engenheiro de Software Sênior")
    c.drawString(50, height - 90, "carlos.silva@email.com | (11) 99999-8888")
    c.drawString(50, height - 110, "linkedin.com/in/carlossilva")

    # Summary
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 150, "Resumo Profissional")
    c.setFont("Helvetica", 12)
    text = "Desenvolvedor full-stack com 10 anos de experiência em Java, Spring Boot e React. Especialista em arquiteturas escaláveis e IA."
    c.drawString(50, height - 170, text)

    # Experience
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 210, "Experiência Profissional")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 230, "Tech Solutions - Desenvolvedor Lead (2020 - Presente)")
    c.setFont("Helvetica", 12)
    c.drawString(70, height - 245, "- Liderança de equipe de 5 desenvolvedores.")
    c.drawString(70, height - 260, "- Migração de arquitetura monolítica para microserviços.")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 290, "Inovação Digital - Desenvolvedor Java (2015 - 2020)")
    c.setFont("Helvetica", 12)
    c.drawString(70, height - 305, "- Desenvolvimento de APIs RESTful e integração com bancos NoSQL.")

    # Education
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 350, "Formação Acadêmica")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 370, "Bacharelado em Ciência da Computação - USP (2011 - 2015)")

    # Skills
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 410, "Habilidades Técnicas")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 430, "Java, Spring Boot, React, Next.js, Docker, Kubernetes, AWS, SQL.")

    c.save()
    print(f"PDF gerado com sucesso: {os.path.abspath(filename)}")

if __name__ == "__main__":
    create_resume("curriculo_teste.pdf")
