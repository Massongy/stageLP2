// EditButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLockQuote}  from '../../hooks/useLockQuote';
import LoadingButton from './LoadingButton';

const EditButton = ({ openedRowRef, quoteId }) => {
  const { quoteLock } = useLockQuote();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await quoteLock(quoteId);
      navigate(`/edition/${openedRowRef}`);
    } catch (err) {
      console.error('Erreur lors du verrouillage:', err);
    }
  };

  return (
    <LoadingButton className="bouton bouton-editer" onClick={handleClick}>
      Éditer
    </LoadingButton>
  );
};

export default EditButton;
