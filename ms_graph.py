import os
from O365 import Account, MSGraphProtocol
from dotenv import load_dotenv

load_dotenv()

class MSListsBackend:
    def __init__(self):
        self.client_id = os.getenv('CLIENT_ID')
        self.client_secret = os.getenv('CLIENT_SECRET')
        self.tenant_id = os.getenv('TENANT_ID')
        self.site_url = os.getenv('SHAREPOINT_SITE_URL')
        
        self.credentials = (self.client_id, self.client_secret)
        self.protocol = MSGraphProtocol()
        self.account = Account(self.credentials, tenant_id=self.tenant_id, protocol=self.protocol)
        
    def authenticate(self):
        """Authenticates with MS Graph API using Client Credentials flow."""
        if not self.account.is_authenticated:
            # Note: For background services (Streamlit server), Client Credentials flow is used.
            # This requires 'Application' permissions in Azure Portal (Sites.ReadWrite.All).
            return self.account.authenticate(scope=['https://graph.microsoft.com/.default'])
        return True

    def get_sharepoint_site(self):
        """Retrieves the SharePoint site object."""
        if not self.authenticate():
            return None
        
        # Site URL usually looks like: https://company.sharepoint.com/sites/SiteName
        # We need to extract the path: /sites/SiteName
        site_path = self.site_url.split('.com')[-1]
        sharepoint = self.account.sharepoint()
        return sharepoint.get_site(site_path)

    def get_or_create_list(self, site, list_name, columns=None):
        """Fetches a list by name or creates it if not found (simulated)."""
        # Note: O365 library handles fetching easily. Creation might need manual setup 
        # or more specific permissions.
        try:
            return site.get_list_by_name(list_name)
        except Exception as e:
            print(f"List {list_name} not found or inaccessible: {e}")
            return None

    def save_operation(self, op_data):
        """Saves a new operation to the 'Operations' list."""
        site = self.get_sharepoint_site()
        if not site:
            return None
        
        ops_list = self.get_or_create_list(site, os.getenv('OPERATIONS_LIST_NAME', 'Geomato_Operations'))
        if not ops_list:
            return None
        
        # Add a new row to the list
        new_row = ops_list.create_list_item(op_data)
        new_row.save()
        return new_row.id # Return the ID to link materials

    def save_materials(self, materials_list, operation_id):
        """Saves materials tied to an operation ID."""
        site = self.get_sharepoint_site()
        if not site:
            return False
            
        mats_list = self.get_or_create_list(site, os.getenv('MATERIALS_LIST_NAME', 'Geomato_Materials'))
        if not mats_list:
            return False
            
        for mat in materials_list:
            mat['OperationID'] = operation_id # Foreign key link
            new_row = mats_list.create_list_item(mat)
            new_row.save()
        return True

    def get_all_operations(self):
        """Retrieves all operations and their materials."""
        site = self.get_sharepoint_site()
        if not site:
            return []
            
        ops_list = self.get_or_create_list(site, os.getenv('OPERATIONS_LIST_NAME', 'Geomato_Operations'))
        if not ops_list:
            return []
            
        items = ops_list.get_items()
        return [item.fields for item in items]
