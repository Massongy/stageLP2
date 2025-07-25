import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Snackbar } from '@mui/material';
import { faUnlock, faArrowUpRightFromSquare, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './DropdownButton';
import PreviewButtonCell from './PreviewButtonCell';
import ConfirmTransferIcon from './ConfirmTransferIcone';
import { useEditQuote } from '../../hooks/useEditQuote';
import '../../assets/datatable.css';


export default function DataTable({data, onPreview, openedRowRef, filterModel, onFilterModelChange }) {
const filteredData = data?.filter(quote => quote.status !== 5) || [];



const { editQuote } = useEditQuote(); 
  const theme = useTheme();
  
  // Breakpoints responsives
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState(null);
    
const [messageType, setMessageType] = useState('success');
  const STATUS_MAPPING = {
  4: 'En cours',
  6: 'Sans intérêt',
  7: 'A traiter'
};
useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // L'alerte disparaît après 3 secondes

      return () => clearTimeout(timer); // Nettoyage du timer lors du démontage du composant
    }
  }, [message]);
const handleTransfer = async (quoteId) => {
  try {
    await editQuote(quoteId, { status: 5 });
    setMessage('Transfert effectué avec succès');
    setMessageType('success');
    setOpenSnackbar(true);
    window.location.reload(); // Rechargement complet de la page
  } catch (error) {
    setMessage(`Erreur lors du transfert : ${error.message}`);
    setMessageType('error');
    setOpenSnackbar(true);
  }
};

    
  // Colonnes adaptatives selon la taille d'écran
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        field: 'lock',
        headerName: '',
        headerAlign: 'center',
        width: isMobile ? 50 : 80,
        minWidth: isMobile ? 50 : 80,
        flex: 0,
        align: 'center',
        renderCell: () => <FontAwesomeIcon icon={faUnlock} className="icone-datatable" />,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      },
      {
        field: 'reference_id_SI',
        headerName: 'Référence',
        headerAlign: 'center',
        width: isMobile ? 80 : isTablet ? 120 : 150,
        minWidth: isMobile ? 80 : isTablet ? 120 : 150,
        flex: 0,
        align: 'center',
        renderHeader: () => (
          <Box className="th-cell-dropdown">
            {isMobile ? 'Réf' : 'Référence'}
            <DropdownButton
              options={[
                { label: 'Tous', value: '' },
                { label: 'Chaud', value: 'Chaud' },
                { label: 'Tiède', value: 'Tiède' },
                { label: 'Froid', value: 'Froid' },
              ]}
            />
          </Box>
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      },
      { 
        field: 'lastname', 
        headerName: isMobile ? 'Nom' : 'Nom', 
        headerAlign: 'center', 
        width: isMobile ? 100 : isTablet ? 150 : 200,
        minWidth: isMobile ? 100 : isTablet ? 150 : 200,
        flex: 0,
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true,
        hideable: false,
      },
      { 
        field: 'firstname', 
        headerName: isMobile ? 'Prenom' : 'Prenom', 
        headerAlign: 'center', 
        width: isMobile ? 100 : isTablet ? 150 : 200,
        minWidth: isMobile ? 100 : isTablet ? 150 : 200,
        flex: 0,
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true,
        hideable: false,
      },
      
      
     {
        field: 'status',
        headerName: 'Statut',
        type: 'singleSelect',
        valueOptions: Object.values(STATUS_MAPPING), // ["En cours", "Sans intérêt", "A traiter"]
        headerAlign: 'center',
        align: 'center',
        width: isMobile ? 70 : 100,
        minWidth: isMobile ? 70 : 100,
        renderHeader: () => (
          <Box className="th-cell-dropdown">
            Statut
            <DropdownButton
              options={Object.values(STATUS_MAPPING).map(label => ({ label, value: label }))}
              
            />
          </Box>
        ),
        renderCell: (params) => {
          const raw = params.row?.status;
          const label = STATUS_MAPPING[raw] ?? raw ?? '';
          return <span>{label}</span>;
        },
        sortable: false,
        filterable: true,
        disableColumnMenu: true,
        hideable: false,
    },
      // Colonne transférer - maintenant toujours présente
      {
        field: 'transfert',
        headerName: isMobile ? 'Transf.' : isTablet ? 'Transf.' : 'Transférer',
        headerAlign: 'center',
        width: isMobile ? 70 : isTablet ? 80 : 120,
        minWidth: isMobile ? 70 : isTablet ? 80 : 120,
        flex: 0,
        align: 'center',
        renderCell: (params) => (
          <ConfirmTransferIcon
            row={params.row}
            onConfirm={(id) => handleTransfer(id)}
          />
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      },
      // Colonne preview toujours présente
      {
        field: 'preview',
        headerName: '',
        width: isMobile ? 50 : 80,
        minWidth: isMobile ? 50 : 80,
        flex: 0,
        align: 'center',
        renderHeader: () => <FontAwesomeIcon icon={faCircleInfo} className="icone-datatable icone-datatable-info" />,
        renderCell: (params) => (
          <PreviewButtonCell row={params.row} isOpen={params.row.reference_id_SI === openedRowRef} onToggle={onPreview} />
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      }
    ];

    return baseColumns;
  }, [onPreview, openedRowRef, onFilterModelChange, isMobile, isTablet]);

  return (

<>
  <Snackbar
    open={openSnackbar}
    autoHideDuration={3000} // Durée d'affichage de 3 secondes
    onClose={() => setOpenSnackbar(false)}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
  >
    <Alert
      onClose={() => setOpenSnackbar(false)}
      severity={messageType}
      sx={{ width: '100%' }}
    >
      {message}
    </Alert>
  </Snackbar>

  <Box sx={{ 
    display: 'flex',
    width: '100%', 
    height: 400,
    overflow: 'hidden',
    '& .MuiDataGrid-root': {
      border: 'none',
      width: '100%',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.grey[50],
      borderBottom: 'none',
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: theme.palette.grey[50],
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none',
      backgroundColor: theme.palette.grey[50],
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiDataGrid-columnHeader': {
        fontSize: '0.75rem',
      },
      '& .MuiDataGrid-cell': {
        fontSize: '0.75rem',
      },
    },
  }}>
    <DataGrid
      rows={filteredData}
      columns={columns}
      filterModel={filterModel}
      onFilterModelChange={onFilterModelChange}
      pageSize={isMobile ? 3 : isTablet ? 5 : 10}
      rowsPerPageOptions={isMobile ? [3, 5] : isTablet ? [5, 10] : [5, 10, 25]}
      disableRowSelectionOnClick
      className="datatable"
      sx={{
        width: '100%',
        height: isMobile ? 300 : isTablet ? 350 : 400,
        '& .MuiDataGrid-main': { overflow: 'visible' },
        '& .MuiDataGrid-virtualScroller': { overflowX: 'auto', overflowY: 'auto' },
        '& .MuiDataGrid-columnHeaders': { minWidth: 'max-content' },
        '& .MuiDataGrid-row': { minWidth: 'max-content' },
        '& .MuiDataGrid-columnHeader': { minWidth: 'unset !important' },
      }}
    />
  </Box>
</>

  );
}