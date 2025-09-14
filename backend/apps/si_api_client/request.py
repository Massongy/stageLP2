import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.questionnaire.serializers import QuestionIdSerializerSIResponse
from django.core.cache import cache
import jwt
import time
import requests

# Request vers l'API du SI 

class ExternalAPIDataView(APIView):
    

                
    def fetchToken(self):
        """
        Fetches the token from the external API.
        """
        usernmame = os.getenv('EXTERNAL_API_USERNAME')
        password = os.getenv('EXTERNAL_API_PASSWORD')
        
        print(f"Fetching token for user: {usernmame}")
        try:
            url = f"{os.getenv('EXTERNAL_API_BASE_URL')}/api/Auth/login"
            response = requests.post(
                url,
                json={'username': usernmame, 'password': password},
            )
            response.raise_for_status()
            token = response.json().get('token')
            cache.set('external_api_token', token, timeout=3600)
            return token
        except requests.RequestException as e:
            print(f"Error retrieving token: {e}")
            return None                 
                
                
                
    def getToken(self):
        # Implement your logic to retrieve the token
        token = cache.get('external_api_token')
        
        if token:
            # Check if the token is still valid
            if self.is_jwt_expired(token):
                print("Token is expired or invalid")
                token = self.fetchToken()
            else:
                print("Token stored is still valid")
        else:
           print("No token found in cache, fetching a new one")
           token = self.fetchToken()
    
        return token
    
   
  


    def is_jwt_expired(self, token: str) -> bool:
        try:
            # Decode without verifying signature
            payload = jwt.decode(token, options={"verify_signature": False})
            exp = payload.get('exp')

            if exp is None:
                # No expiration claim = treat as expired for safety
                return True

            current_time = int(time.time())
            return current_time >= exp  # True means expired

        except jwt.DecodeError:
            # Invalid token format
            return True
