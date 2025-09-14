import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const StatusFilterButton = ({ statusOptions, currentFilter, onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (statusValue) => {
    onFilterChange(statusValue);
    handleClose();
  };

  const isFiltered = currentFilter && currentFilter !== 'all';

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
       
        
      >
        <FontAwesomeIcon 
          icon={faAngleDown} 
         
        />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            minWidth: 150,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleStatusSelect('all')}
          selected={!isFiltered}
          sx={{ fontSize: '0.875rem' }}
        >
          Tous les statuts
        </MenuItem>
        
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleStatusSelect(option.value)}
            selected={currentFilter === option.value}
            sx={{ fontSize: '0.875rem' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default StatusFilterButton;
