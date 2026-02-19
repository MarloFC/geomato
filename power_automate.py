import requests
import os
from dotenv import load_dotenv

load_dotenv()

class PowerAutomateBackend:
    def __init__(self, url=None):
        self.webhook_url = url or os.getenv('POWER_AUTOMATE_URL')

    def send_operation(self, op_data, url=None):
        target_url = url or self.webhook_url
        if not target_url:
            print("Error: POWER_AUTOMATE_URL not provided.")
            return False
            
        try:
            response = requests.post(
                target_url, 
                json=op_data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"Error sending data to Power Automate: {e}")
            return False
