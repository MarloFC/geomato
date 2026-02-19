import streamlit as st
import pandas as pd
from datetime import datetime
from power_automate import PowerAutomateBackend

# Initialize Backend
backend = PowerAutomateBackend()

# Page Configuration
st.set_page_config(
    page_title="Geomato - Dashboard de Operações",
    page_icon="🏗️",
    layout="wide",
)

# Custom Styling (Inspired by React App)
st.markdown("""
    <style>
    .main {
        background-color: #f8fafc;
    }
    .stButton>button {
        background-color: #008542;
        color: white;
        border-radius: 6px;
        border: none;
    }
    .stButton>button:hover {
        background-color: #006b35;
    }
    .header-style {
        color: #008542;
        font-weight: bold;
    }
    </style>
    """, unsafe_allow_html=True)

# Initialize Session State
if 'operations' not in st.session_state:
    st.session_state.operations = []

# Sidebar Navigation
st.sidebar.title("Geomato")
page = st.sidebar.selectbox("Navegação", ["Dashboard", "Nova Operação", "Configurações MS Lists"])

if page == "Dashboard":
    st.title("🏗️ Painel de Operações")
    
    if not st.session_state.operations:
        st.info("Nenhuma operação registrada ainda. Vá para 'Nova Operação' para começar.")
    else:
        for op in st.session_state.operations:
            with st.expander(f"{op['title']} - {op['embarcacao']}"):
                col1, col2 = st.columns(2)
                with col1:
                    st.write(f"**Data:** {op['dataCarregamento']}")
                    st.write(f"**Coroa BE:** {op['coroaBE']}")
                    st.write(f"**Coroa BB:** {op['coroaBB']}")
                with col2:
                    st.write(f"**STO:** {op['stoRespo']}")
                    st.write(f"**Apoio:** {op['apoioRespo']}")
                
                st.write("**Observações:**")
                st.write(op['obsEmbarque'])
                
                if op['materials']:
                    st.write("**Materiais:**")
                    st.dataframe(pd.DataFrame(op['materials']))

elif page == "Nova Operação":
    st.title("🆕 Nova Operação")
    
    with st.form("operation_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        
        with col1:
            title = st.text_input("Título do Plano", placeholder="Ex: P-52 Desembarque")
            embarcacao = st.text_input("Embarcação")
            data_carregamento = st.date_input("Data de Carregamento", value=datetime.today())
            coroa_be = st.text_input("Coroa Instalada BE")
        
        with col2:
            coroa_bb = st.text_input("Coroa Instalada BB")
            sto_respo = st.text_input("STO Responsável")
            apoio_respo = st.text_input("Apoio Responsável")
            
        obs_embarque = st.text_area("Observações de Embarque")
        
        st.subheader("Materiais")
        # For the prototype, we'll use a data editor for materials
        materials_df = pd.DataFrame(columns=["Material", "Quantidade", "Armazenamento", "Objetivo"])
        edited_materials = st.data_editor(materials_df, num_rows="dynamic")
        
        submitted = st.form_submit_button("Criar Operação")
        
        if submitted:
            if not title:
                st.error("O título é obrigatório!")
            else:
                new_op = {
                    "id": len(st.session_state.operations) + 1,
                    "title": title,
                    "embarcacao": embarcacao,
                    "dataCarregamento": str(data_carregamento),
                    "coroaBE": coroa_be,
                    "coroaBB": coroa_bb,
                    "stoRespo": sto_respo,
                    "apoioRespo": apoio_respo,
                    "obsEmbarque": obs_embarque,
                    "materials": edited_materials.to_dict('records')
                }
                st.session_state.operations.append(new_op)
                
                # Send to Power Automate
                with st.spinner("Enviando dados para o SharePoint..."):
                    # Use URL from session state if available, otherwise fallback to .env
                    url = st.session_state.get('webhook_url')
                    success = backend.send_operation(new_op, url=url)
                    if success:
                        st.success("Operação criada e salva no SharePoint com sucesso!")
                    else:
                        st.error("Operação criada localmente, mas falhou ao enviar para o SharePoint. Verifique a URL do Power Automate.")

elif page == "Configurações MS Lists":
    st.title("⚙️ Configuração Power Automate")
    st.info("Insira a URL do Webhook gerada no Power Automate.")
    
    webhook_url = st.text_input("Power Automate Webhook URL", type="password", help="A URL que começa com https://prod-....")
    
    if st.button("Salvar URL"):
        st.session_state.webhook_url = webhook_url
        st.success("URL salva na sessão!")
