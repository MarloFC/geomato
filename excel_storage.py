import pandas as pd
import os
from datetime import datetime

class ExcelStorage:
    def __init__(self, file_path="geomato_database.xlsx"):
        self.file_path = file_path
        self._initialize_db()

    def _initialize_db(self):
        """Creates the Excel file with necessary sheets if it doesn't exist."""
        if not os.path.exists(self.file_path):
            with pd.ExcelWriter(self.file_path, engine='openpyxl') as writer:
                pd.DataFrame(columns=[
                    "id", "title", "embarcacao", "dataCarregamento", 
                    "coroaBE", "coroaBB", "obsEmbarque", "stoRespo", "apoioRespo"
                ]).to_excel(writer, sheet_name="Operations", index=False)
                
                pd.DataFrame(columns=[
                    "operation_id", "material", "quantidade", "armazenamento", "objetivo"
                ]).to_excel(writer, sheet_name="Materials", index=False)

    def save_operation(self, op_data, materials):
        """Saves a new operation and its materials to the Excel file."""
        # Load existing operations
        ops_df = pd.read_excel(self.file_path, sheet_name="Operations")
        mats_df = pd.read_excel(self.file_path, sheet_name="Materials")
        
        # New Operation ID
        new_id = int(ops_df["id"].max() + 1) if not ops_df.empty else 1
        
        # Add Operation
        op_data["id"] = new_id
        new_op_row = pd.DataFrame([op_data])
        ops_df = pd.concat([ops_df, new_op_row], ignore_index=True)
        
        # Add Materials
        if materials:
            for m in materials:
                m["operation_id"] = new_id
            new_mats_df = pd.DataFrame(materials)
            mats_df = pd.concat([mats_df, new_mats_df], ignore_index=True)
            
        # Save back to Excel
        with pd.ExcelWriter(self.file_path, engine='openpyxl') as writer:
            ops_df.to_excel(writer, sheet_name="Operations", index=False)
            mats_df.to_excel(writer, sheet_name="Materials", index=False)
            
        return new_id

    def load_operations(self):
        """Loads all operations with their nested materials."""
        try:
            ops_df = pd.read_excel(self.file_path, sheet_name="Operations")
            mats_df = pd.read_excel(self.file_path, sheet_name="Materials")
            
            operations = []
            for _, row in ops_df.iterrows():
                op = row.to_dict()
                # Filter materials for this operation
                op_mats = mats_df[mats_df["operation_id"] == op["id"]].to_dict('records')
                op["materials"] = op_mats
                operations.append(op)
            
            return operations
        except Exception as e:
            print(f"Error loading data: {e}")
            return []

    def delete_operation(self, op_id):
        """Deletes an operation and its associated materials."""
        ops_df = pd.read_excel(self.file_path, sheet_name="Operations")
        mats_df = pd.read_excel(self.file_path, sheet_name="Materials")
        
        ops_df = ops_df[ops_df["id"] != op_id]
        mats_df = mats_df[mats_df["operation_id"] != op_id]
        
        with pd.ExcelWriter(self.file_path, engine='openpyxl') as writer:
            ops_df.to_excel(writer, sheet_name="Operations", index=False)
            mats_df.to_excel(writer, sheet_name="Materials", index=False)
