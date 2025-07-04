import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function PreviewButtonCell({ row, isOpen, onToggle }) {
  const handleClick = () => {
    onToggle(row);
  };

  return (
    <FontAwesomeIcon
      icon={isOpen ? faTimes : faCircleArrowRight}
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
      className="icone-datatable"
    />
  );
}
