import os
import requests
from ..si_api_client import request as si_api_request
from rest_framework import status
from rest_framework.response import Response



class QuestionnaireExternalAPIRequest:
    """
    Base class for external API requests related to questionnaires.
    This class can be extended to implement specific API request logic.
    """
    
    def __init__(self, api_url: str):
        self.api_url = os.getenv('EXTERNAL_API_BASE_URL', api_url)

    def get_api_url(self) -> str:
        """
        Returns the API URL for the questionnaire service.
        """
        return self.api_url

    def fetch_questionnaires(self, demand_id: int):
        
        endpoint = self.get_api_url() + '/Questionaire/GetQuestionnaire/' + str(demand_id)
        try: 
            token = si_api_request.ExternalAPIDataView().getToken()
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(endpoint, headers=headers, timeout=10)
            response.raise_for_status()
            print(f"Response from external API: {response.content}")
            return Response(response.json(), status=status.HTTP_200_OK)  # Assuming the response is in JSON format
        except requests.HTTPError as e:
            print(f"HTTP error occurred: {e}")
            if response.status_code == 404:
                print("404 status code received, no questionnaire found")
                return Response({"error": "No questionnaire found"}, status=status.HTTP_404_NOT_FOUND)
            # Handle HTTP errors
            return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        """
        Placeholder method to fetch questionnaires from the external API.
        This should be implemented in subclasses.
        """
        
    #serializer_class = QuestionIdSerializerSIResponse  # Define your serializer class if needed
    
    def get_questions(self):
        endpoint = self.api_url + '/QuestionReponse/GetListeQuestions?idEtablissement=151'
        token = si_api_request.ExternalAPIDataView().getToken()
        headers = {
            "Authorization":f"Bearer {token}",
            "Accept": "application/json"
        }

        try:
            print(f"Requesting external API'")
            external_response = requests.get(endpoint, headers=headers, timeout=10)        
            external_response.raise_for_status()  # Raises exception for 4xx/5xx       
            print(f"Response from external API: {external_response.json()}")
            return Response(external_response.json(), status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            if external_response.status_code == 401:
                print("401 status code received, token might be expired or unauthorized")
                res = {
                    "data": "Token expired or unauthorized",
                    "status": external_response.status_code,
                    "exception": "Unauthorized access. Please check your token."
                }
              
                return res
            
            else:
                print(f"Error occurred: {e}")
                # Handle other request exceptions
                return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
                )
                
    def get_answers(self):
        endpoint = self.api_url + '/QuestionReponse/GetListeReponses?idEtablissement=151'
        token = si_api_request.ExternalAPIDataView().getToken()
        headers = {
            "Authorization":f"Bearer {token}",
            "Accept": "application/json"
        }

        try:
            print(f"Requesting external API to endpoint: {endpoint}")
            external_response = requests.get(endpoint, headers=headers, timeout=10)        
            external_response.raise_for_status()  # Raises exception for 4xx/5xx       
            return Response(external_response.json(), status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            if external_response.status_code == 401:
                print("401 status code received, token might be expired or unauthorized")
                res = {
                    "data": "Token expired or unauthorized",
                    "status": external_response.status_code,
                    "exception": "Unauthorized access. Please check your token."
                }
              
                return res
            
            else:
                print(f"Error occurred: {e}")
                # Handle other request exceptions
                return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
                )