import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import InfoDemande from './InfoDemande';  // Assure-toi que le chemin est correct

export default function Editionquestionsreponses() {
  // Définir des données en dur (ou remplacer par des données API plus tard)
  const [questionsData, setQuestionsData] = useState([
    { question: "Avez-vous déjà fait appel à option ? ", reponses: ['Oui', 'Non'] },
    { question: "Votre évènement est-il à ttire particulier ou professionnel ?", reponses: ['Particulier', 'Professionnel'] },
    { question: "La date de votre évènement est-elle fixée ?", reponses: ['Oui', 'Non']  },
        { question: "Si oui, à quelle date ?", reponses: [new Date().toLocaleDateString() ] },

    { question: "Le lieu de votre événement est-il réservé ?", reponses: ['Oui', 'Non', 'Pas sûr'] },
    { question: "Pouvez vous me donner une fourchette de votre budget ?", reponses: ['Non', '0-499 E', '500-1000 E', 'Plus de 1000 E'] },
        { question: "Souhaitez-vous qu'un conseiller clientèle vous rappelle ?", reponses: ['Oui', 'Non'] }

  ]);

  useEffect(() => {
    // Simuler la récupération de données depuis une API
    // Remplace par un appel API réel plus tard
    // Exemple:
    // fetch('/api/questions')
    //   .then(res => res.json())
    //   .then(data => setQuestionsData(data));
  }, []); // Le tableau vide signifie que cet effet est exécuté uniquement au premier rendu.

  return (
    <Box sx={{ width: '1920px', margin: '0 auto', display: 'flex', flexDirection: 'row',flexWrap: 'wrap' }}>
      {questionsData.map((item, index) => (
        <InfoDemande
          key={index}
          question={item.question}
          reponses={item.reponses}
        />
      ))}
    </Box>
  );
}
