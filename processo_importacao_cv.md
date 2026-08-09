# Arquitetura e Processo de Importação de Currículos via IA

## 1. Visão Geral
Este documento descreve detalhadamente o design técnico e o fluxo de dados para a nova funcionalidade "Importar Currículo" do **CVFacil.NG**. O objetivo principal é permitir o upload de um currículo em formato PDF, utilizar técnicas avançadas de Processamento de Linguagem Natural (NLP) e IA para a extração dos dados intrínsecos e mapeá-los estruturalmente para permitir a fácil remontagem ou alteração de layout.

---

## 2. Diagrama de Fluxo e Componentes

A arquitetura sugere um fluxo em multi-estágios separando a responsabilidade de Interface (Frontend em Next.js), Gateway de API (Spring Boot App) e Camada Limpa de NLP:

1. **Upload via Interface:** O usuário seleciona no Dashboard a opção de Importar PDF. 
2. **Gateway:** O arquivo multipart é validado pelo Backend (Tamanho, Mimetype Seguro). Um Parsing estático raso (Apache PDFBox) é feito para recuperar o Buffer de String crua do documento.
3. **Módulo de NLP/Inteligência Artificial:** O texto passa por sanitização leve e é enviado para uma API Conversacional Orientada à Extração Estruturada (Ex: `gpt-4o-mini` ou similar). O modelo fará a Extração de Entidades Nomeadas (NER) formatado como um JSON mapeado estritamente para o Schema de domínio.
4. **Armazenamento de Pool (Draft):** O json resultante recebe um UID e é serializado na Sessão (ou cache rápido ex: Redis) do usuário, enquanto ele não aprovar o "Preview". 
5. **Conversão & Seleção de Layout:** A interface exibe os campos identificados para rápida revisão manual. O utilizador aprova a importação e seleciona o Template Base. 
6. **Persistência Final:** O layout reune o Payload JSON validado e a Engine (RDBMS do Spring) injeta os registros de tabelas isoladas (Education, Experience, Skills, Profile).


---

## 3. Detalhamento de Etapas Funcionais

### Etapa 1: Importação de Currículos
**Componentes e Regras Claves:**
- **Endpoint Backend:** POST `/api/v1/resumes/import` (`multipart/form-data`)
- **Frontend Controller:** O Botão "Importar" no arquivo `dashboard/resumes.js` lança o workflow com um `<input type="file" accept="application/pdf">`.

### Etapa 2: Extração de Dados com IA
*Transformar texto não-estruturado em Schema Relacional de Currículo.*

**Seleção Tecnológica Sugerida (Spring Backend):**
- Utilização de `Spring AI` ou `LangChain4j` para instanciar as Chamadas a LLMs remotamente.
- O Processamento de PDF puro em Java: `Apache PDFBox` ou `iText`.

**Contrato de Retorno do Serviço de IA (Representação JSON):**
```json
{
  "nomeCompleto": "João Silva",
  "informacoesContato": {"email": "joao@email.com", "telefone": "11999999999"},
  "experienciaProfissional": [
     {"cargo": "Desenvolvedor Backend", "empresa": "Tech LTDA", "periodo": "2020-Atual", "descricao": "..."}
  ],
  "formacaoAcademica": [...],
  "habilidades": ["Java", "Spring", "React", "Postgres"]
}
```

### Etapa 3: Armazenamento Temporário
Evita corromper dados no DB Final. 
Sugestão: Uso da tabela `resume_drafts` com status temporário, ou simples alocação em um par Chave-Valor em Memória. 

### Etapa 4 e 5: Seleção e Aplicação de Novo Layout
A plataforma de CVFacil separa logicamente as propriedades e layouts. Se o motor da UI possuir um componente de Tema Genérico com Props: `ResumeViewer({ data: json_data, templateId: 4 })`, toda a visualização "muda de cara" dinamicamente pois o conteúdo flui para espaços controlados pelos estilos Premium em React sem perda da fonte central armazenada.  

### Etapa 6: Manutenção da Funcionalidade de Dados
Para o Editor Final, as APIs de requisição (PUT e PATCH) serão as exatas mesmas já contidas em `/api/v1/resumes/{id}`. O layout selecionado é meramente um campo metadados (`layoutType` string) preenchido no Registro Raiz de Resumes. Modificar o layout posterior não toca nos relacionamentos 1-N (Um currículo para Múltiplas Experiências) da base de dados PostgreSQL.

---

## 4. Considerações de Segurança e Tratamentos 
1. **Velocidade versus Precisão:** OCR nativo em PDFs compostos por Imagens onerará o serviço. Deve-se considerar rejeitar temporariamente "PDFs Escaneados" para MVP 1 ou envolver pacotes híbridos robustos como Tesseract OCR, ciente do tradeoff pesado de lentidão no Worker.
2. **Tratamento de Alucinações:** Modelos generativos tendem a interpolar e tentar "consertar buracos" se o conteúdo original faltar sentido. Requer *Prompt Engineering* blindado limitando criatividade (Temperature = 0) e exigindo *Strict Nulls*.
3. **Escalamento:** Por causa dos custos atrelados à Inteligências Artificiais e Rate Limits, é recomendável um Filas de Mensagerias (como Kafka ou RabbitMQ dependendo do throughput futuro) para assegurar entrega assíncrona caso mais dezenas subam simultaneamente, disparando Webhooks ou Polling pro Frontend do usuário assim que finalizado.
