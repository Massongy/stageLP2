import requests

def getDemande(demandeId):
    response = requests.get(f"http://localhost:5017/Questionaire/GetQuestionnaire/{demandeId}")
    response.raise_for_status()
    print(response.content)
    return response.json()
