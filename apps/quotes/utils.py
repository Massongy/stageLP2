from .models import Status

def map_api_to_quote_dict(api_data):
        """
        Convert a single API record to Quote serializer-compatible dictionary
        """
       # status_obj = Status.objects.filter(id=api_data.get("statut")).first()
        return {
            "reference_id_SI": api_data.get("idKey"),
            "date_first_call": api_data.get("datePremierAppel"),
            "date_last_call": api_data.get("dateDernierAppel"),
            "firstname": api_data.get("firstName"),
            "lastname": api_data.get("lastName"),
            "phone": api_data.get("numeroTelephone"),
            "customer_email": api_data.get("emailLien"),
          #  "status": status_obj.pk if status_obj else None,
            "weeknumber": api_data.get("semaineNumero"),
            "call_count": api_data.get("nbTentativeAppel"),
            "idEtablissement": api_data.get("idEtablissement"),
            "order_id": api_data.get("orderId"),  # Default to empty string if not present
            "reference": api_data.get("referenceDemande"),
            "questionnaire": api_data.get("questionnaire"),
        }