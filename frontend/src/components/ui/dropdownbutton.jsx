import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DropDownButton({ options, onSelect }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = e => setAnchorEl(e.currentTarget);
  const handleClose = value => {
    setAnchorEl(null);
    if (value !== undefined) onSelect(value);
  };

  return (
    <>
      <Button 
        
        endIcon={<FontAwesomeIcon icon={faAngleDown} style={{ color: 'black' }} />}
        onClick={handleClick}
      >
        
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        {options.map(opt => (
          <MenuItem key={opt.value} onClick={() => handleClose(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

  
