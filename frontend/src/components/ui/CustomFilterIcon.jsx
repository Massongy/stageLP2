import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useGridApiContext } from '@mui/x-data-grid';

function CustomFilterIcon({ field, counter, onClick }) {
  const apiRef = useGridApiContext();

  const handleClick = (event) => {
    event.stopPropagation();
    onClick?.(apiRef.current.getColumnHeaderParams(field), event);
  };

  return (
    <button onClick={handleClick} style={{ border: 'none', background: 'transparent' }}>
      <FontAwesomeIcon icon={faAngleDown} style={{ color: 'black' }} />
    </button>
  );
}

export default CustomFilterIcon;
