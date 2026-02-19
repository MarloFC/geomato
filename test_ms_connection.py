from ms_graph import MSListsBackend
import os
from dotenv import load_dotenv

def test_connection():
    print("--- Testando Conexão com Microsoft Graph ---")
    load_dotenv()
    
    backend = MSListsBackend()
    
    print("1. Autenticando...")
    try:
        if backend.authenticate():
            print("✅ Autenticação bem-sucedida!")
        else:
            print("❌ Falha na autenticação. Verifique CLIENT_ID, CLIENT_SECRET e TENANT_ID.")
            return
    except Exception as e:
        print(f"❌ Erro na autenticação: {e}")
        return

    print(f"2. Conectando ao site: {os.getenv('SHAREPOINT_SITE_URL')}...")
    try:
        site = backend.get_sharepoint_site()
        if site:
            print(f"✅ Site '{site.name}' encontrado!")
        else:
            print("❌ Site não encontrado. Verifique a URL do SharePoint.")
            return
    except Exception as e:
        print(f"❌ Erro ao acessar site: {e}")
        return

    print(f"3. Verificando lista de Operações...")
    try:
        ops_list = backend.get_or_create_list(site, os.getenv('OPERATIONS_LIST_NAME', 'Geomato_Operations'))
        if ops_list:
            print(f"✅ Lista '{ops_list.name}' acessível!")
        else:
            print(f"❌ Lista não encontrada. Certifique-se de que a lista existe no SharePoint.")
    except Exception as e:
        print(f"❌ Erro ao acessar lista: {e}")

if __name__ == "__main__":
    test_connection()
