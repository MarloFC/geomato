import streamlit as st
import pandas as pd
from datetime import datetime
from excel_storage import ExcelStorage
import os

# Page Configuration
st.set_page_config(
    page_title="Geomato - Dashboard de Operações",
    page_icon="🏗️",
    layout="wide",
)

# Initialize Storage
# You can change this path to your SharePoint synced folder
db_path = st.sidebar.text_input("Caminho do Banco de Dados (Excel)", value="geomato_database.xlsx")
storage = ExcelStorage(db_path)

# Custom Styling
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
        width: 100%;
    }
    .stButton>button:hover {
        background-color: #006b35;
    }
    .op-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        border-left: 5px solid #008542;
    }
    </style>
    """, unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.title("Geomato")
page = st.sidebar.selectbox("Navegação", ["Dashboard", "Nova Operação"])

if page == "Dashboard":
    st.title("🏗️ Painel de Operações")
    
    # Reload data from Excel
    operations = storage.load_operations()
    
    if not operations:
        st.info("Nenhuma operação registrada ainda. Vá para 'Nova Operação' para começar.")
    else:
        # Search/Filter
        search = st.text_input("🔍 Buscar por título ou embarcação", "")
        
        filtered_ops = [
            op for op in operations 
            if search.lower() in str(op['title']).lower() or search.lower() in str(op['embarcacao']).lower()
        ]

        for op in filtered_ops:
            with st.expander(f"📦 {op['title']} | {op['embarcacao']} | {op['dataCarregamento']}"):
                col1, col2 = st.columns(2)
                with col1:
                    st.write(f"**Data:** {op['dataCarregamento']}")
                    st.write(f"**Coroa BE:** {op['coroaBE']}")
                    st.write(f"**Coroa BB:** {op['coroaBB']}")
                with col2:
                    st.write(f"**STO:** {op['stoRespo']}")
                    st.write(f"**Apoio:** {op['apoioRespo']}")
                
                st.write("**Observações:**")
                st.info(op['obsEmbarque'] if op['obsEmbarque'] else "Sem observações.")
                
                if op['materials']:
                    st.write("**Lista de Materiais:**")
                    # Clean up materials for display (remove internal ID)
                    display_mats = pd.DataFrame(op['materials']).drop(columns=['operation_id'], errors='ignore')
                    st.table(display_mats)
                
                if st.button(f"Excluir Operação {op['id']}", key=f"del_{op['id']}"):
                    storage.delete_operation(op['id'])
                    st.toast(f"Operação {op['id']} excluída!")
                    st.rerun()

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
        
        st.subheader("📋 Materiais")
        # Initialize an empty template for materials
        template_df = pd.DataFrame(columns=["material", "quantidade", "armazenamento", "objetivo"])
        edited_materials = st.data_editor(
            template_df, 
            num_rows="dynamic", 
            use_container_width=True,
            column_config={
                "material": st.column_config.TextColumn("Material"),
                "quantidade": st.column_config.NumberColumn("Qtd"),
                "armazenamento": st.column_config.TextColumn("Armazenamento"),
                "objetivo": st.column_config.TextColumn("Objetivo")
            }
        )
        
        submitted = st.form_submit_button("Gerar Plano de Operação")
        
        if submitted:
            if not title:
                st.error("O título é obrigatório!")
            else:
                op_data = {
                    "title": title,
                    "embarcacao": embarcacao,
                    "dataCarregamento": str(data_carregamento),
                    "coroaBE": coroa_be,
                    "coroaBB": coroa_bb,
                    "stoRespo": sto_respo,
                    "apoioRespo": apoio_respo,
                    "obsEmbarque": obs_embarque
                }
                
                # Convert materials to list of dicts and clean up empty rows
                mats_list = edited_materials.dropna(how='all').to_dict('records')
                
                new_id = storage.save_operation(op_data, mats_list)
                st.success(f"Operação #{new_id} salva com sucesso no Excel!")
                st.balloons()
