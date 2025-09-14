def map_api_to_questionnaire_dict(response_data):
    """
    Convert a single API record to Questionnaire serializer-compatible dictionary.
    """
    return {
        "quote": response_data.get("demandeId"),
        "opName": response_data.get("nomOP"),
        "potential": response_data.get("libPotentiel"),
        "reference_id_SI": response_data.get("idQuestionnaire"),
        "updated_at": response_data.get("idGrillePotentiel"),
        "questions": response_data.get("questionsReponsesList", []),  # Assuming questions is a list
    }
    


def map_api_to_given_answer_dict(response_data):
    """
    Convert a single API record to GivenAnswer serializer-compatible dictionary.
    """
    return {
        "answer": response_data.get("reponsePossibleId"),
    }