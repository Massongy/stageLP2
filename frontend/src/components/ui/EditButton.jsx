// EditButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLockQuote}  from '../../hooks/useLockQuote';

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
    <button onClick={handleClick}>
      Éditer
    </button>
  );
};

export default EditButton;
