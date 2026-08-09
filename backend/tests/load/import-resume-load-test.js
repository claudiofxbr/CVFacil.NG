import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

/**
 * CVFacil.NG - Script de Teste de Carga para Importação de Currículos
 * Ferramenta: k6 (Grafana)
 * Objetivo: Validar estabilidade da integração Gemini + Spring Boot sob carga.
 */

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up inicial
    { duration: '2m', target: 30 },  // Carga sustentada
    { duration: '30s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    // 95% das extrações de IA devem terminar em menos de 20 segundos
    http_req_duration: ['p(95)<20000'],
    // Taxa de erro de importação deve ser menor que 2%
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const binFile = open('./test-resume.pdf', 'b');

export function setup() {
  // Login para obter o token JWT
  // Nota: Certifique-se que o usuário test-qa@cvfacil.com existe no banco de homologação
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test-qa@cvfacil.com',
    password: 'Password123!'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status !== 200) {
    console.error(`Falha no login do setup: ${loginRes.status} - ${loginRes.body}`);
    return null;
  }

  return loginRes.json().token;
}

export default function (token) {
  if (!token) {
    console.error('VU sem token de autenticação. Pulando iteração.');
    return;
  }

  const fd = new FormData();
  fd.append('file', http.file(binFile, 'resume-load-test.pdf', 'application/pdf'));

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${fd.boundary}`,
    },
    timeout: '60s', // Timeout estendido para processamento de IA
  };

  // Simula o upload do arquivo
  const res = http.post(`${BASE_URL}/resumes/import`, fd.body(), params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has valid id': (r) => r.json() && r.json().id !== undefined,
    'ai extracted name': (r) => r.json() && r.json().fullName !== null,
  });

  // Simula o tempo que um usuário levaria para revisar o currículo extraído
  sleep(2 + Math.random() * 5);
}
