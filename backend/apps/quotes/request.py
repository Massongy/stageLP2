import os
import requests
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status
from ..si_api_client import request as si_api_request
from .utils import map_api_to_quote_dict
from .serializers import QuoteSerializer  



class QuotesExternalAPIRequest:
    """
    Base class for external API requests related to quotes.
    This class can be extended to implement specific API request logic.
    """
    serializer_class = None  # Should be set in subclasses
    
    def __init__(self, api_url: str):
        self.api_url = os.getenv('EXTERNAL_API_BASE_URL', api_url)
    def get_api_url(self) -> str:
        """
        Returns the API URL for the quotes service.
        """
        return self.api_url

    def fetch_quotes(self):
        today = datetime.today().strftime("%Y-%m-%d")
        endpoint = self.get_api_url() + '/DemandesWeb/GetListeDemande'
        payload = {
            'DateDebut': '2021-01-01',
            'DateFin': today,
            'IdEtablissement': '151'
        }
        print(f"Fetching quotes from endpoint: {endpoint}")
        
        """
        Placeholder method to fetch quotes from the external API.
        This should be implemented in subclasses.
        """
        try:
            token = si_api_request.ExternalAPIDataView().getToken()
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(endpoint, params=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            
            return Response(response.json(), status=status.HTTP_200_OK)  
            
            
           #  return Response(response.json(), status=status.HTTP_200_OK)  # Assuming the response is in JSON format
            
        except requests.HTTPError as e:
            print(f"HTTP error occurred: {e}")
            # Handle HTTP errors
            return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
            
    def update_quote(self, quote_id, data):
        """
        Placeholder method to update a quote in the external API.
        This should be implemented in subclasses.
        """
        raise NotImplementedError("This method should be implemented in subclasses.")
    

            
            
      