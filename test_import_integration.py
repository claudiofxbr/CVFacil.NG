import requests
import json
import os
import sys

# Forçar UTF-8 para o terminal Windows
if sys.stdout.encoding != 'utf-8':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://localhost:7777/api"

def test_ai_import():
    print("--- INICIANDO TESTE DE IMPORTACAO IA ---")
    
    login_data = {
        "email": "admin@cvfacil.com.br",
        "password": "Admin123!"
    }
    
    print(f"Tentando login como {login_data['email']}...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"Erro no login ({response.status_code}): {response.text}")
            return

        token = response.json().get("token")
        print("Login realizado com sucesso!")
    except Exception as e:
        print(f"Falha ao conectar ao backend: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}
    file_path = "curriculo_teste.pdf"
    
    if not os.path.exists(file_path):
        print(f"Arquivo {file_path} nao encontrado.")
        return

    print(f"Enviando {file_path} para extracao IA...")
    try:
        with open(file_path, "rb") as f:
            files = {"file": (file_path, f, "application/pdf")}
            import_response = requests.post(f"{BASE_URL}/resumes/import", headers=headers, files=files)
            
        if import_response.status_code == 200:
            result = import_response.json()
            print("\nSUCESSO NA IMPORTACAO!")
            print("--- DADOS EXTRAIDOS PELA IA ---")
            print(json.dumps(result, indent=4, ensure_ascii=False))
            print("-------------------------------")
        else:
            print(f"\nFALHA NA IMPORTACAO ({import_response.status_code})")
            print(f"Resposta do Servidor: {import_response.text}")
            
    except Exception as e:
        print(f"Erro durante o upload: {e}")

if __name__ == "__main__":
    test_ai_import()
