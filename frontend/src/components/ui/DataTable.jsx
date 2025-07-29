import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Snackbar } from '@mui/material';
import { faLock, faUnlock,  faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './DropdownButton';
import PreviewButtonCell from './PreviewButtonCell';
import ConfirmTransferIcon from './ConfirmTransferIcone';
import { useEditQuote } from '../../hooks/useEditQuote';
import { useGetLockedQuotes } from '../../hooks/useGetLockedQuotes';
import { 
  GridFilterInputSingleSelect,
  getGridSingleSelectOperators 
} from '@mui/x-data-grid';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import '../../assets/datatable.css';

export default function DataTable({data, onPreview, openedRowRef, filterModel, onFilterModelChange }) {

  const filteredData = (data || []).filter(quote => quote.status !== 5);
  const {lockedQuotes} = useGetLockedQuotes();
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTransfer = async (quoteId) => {
    try {
      await editQuote(quoteId, { status: 5 });
      setMessage('Transfert effectué avec succès');
      setMessageType('success');
      setOpenSnackbar(true);
      window.location.reload();
    } catch (error) {
      setMessage(`Erreur lors du transfert : ${error.message}`);
      setMessageType('error');
      setOpenSnackbar(true);
    }
  };

  // Génération dynamique des valueOptions basée sur les données réelles
  const getStatusValueOptions = () => {
    // Récupérer tous les statuts uniques présents dans les données
    const uniqueStatusesInData = [...new Set(filteredData.map(item => item.status).filter(status => status != null))];
    
    // Créer les options seulement pour les statuts qui existent dans les données
    return uniqueStatusesInData.map(status => ({
      value: Number(status),
      label: STATUS_MAPPING[status] || `Statut ${status}`
    }));
  };

  // Colonnes adaptatives selon la taille d'écran
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        field: 'lock',
        headerName: '',
        headerAlign: 'center',
        width: isMobile ? 30 : 60,
        minWidth: isMobile ? 30 : 60,
        flex: 0,
        align: 'center',
        renderCell: (params) => {
          const isLocked = lockedQuotes.some(lockedQuote => lockedQuote.quote === params.row.id);
          return (
            <FontAwesomeIcon 
              icon={isLocked ? faLock : faUnlock} 
              className="icone-datatable" 
            />
          );
        },
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
       
      },
      {
        field: 'reference_id_SI',
        headerName: 'Référence',
        headerAlign: 'center',
        width: isMobile ? 80 : isTablet ? 120 : 120,
        minWidth: isMobile ? 80 : isTablet ? 120 : 120,
        flex: 0,
        align: 'center',
        
        
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
        headerClassName: 'th-cell',
      },
      { 
        field: 'lastname', 
        headerName: isMobile ? 'Nom' : 'Nom', 
        headerAlign: 'center', 
        width: isMobile ? 100 : isTablet ? 150 : 150,
        minWidth: isMobile ? 100 : isTablet ? 150 : 150,
        flex: 0,
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true,
        hideable: false,
        headerClassName: 'th-cell',
      },
      { 
        field: 'firstname', 
        headerName: isMobile ? 'Prénom' : 'Prénom', 
        headerAlign: 'center', 
        width: isMobile ? 100 : isTablet ? 150 : 150,
        minWidth: isMobile ? 100 : isTablet ? 150 : 150,
        flex: 0,
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true,
        hideable: false,
        headerClassName: 'th-cell',
      },
          
     
      {
  field: 'status',
  headerName: 'Statut',
  type: 'singleSelect',
  valueOptions: getStatusValueOptions(),
  valueFormatter: (params) => STATUS_MAPPING[params.value] || `Statut ${params.value}`,
  renderCell: (params) => (
    <span>{STATUS_MAPPING[params.value] || `Statut ${params.value}`}</span>
  ),
  headerAlign: 'center',
  align: 'center',
  width: isMobile ? 100 : isTablet ? 120 : 140,
  minWidth: isMobile ? 100 : isTablet ? 120 : 140,
  flex: 0,
  sortable: false,
  filterable: true,
  disableColumnMenu: false,
  hideable: false,
  headerClassName: 'th-cell',
  // Personnalisation du filtre
  filterOperators: getGridSingleSelectOperators().filter(
    (operator) => operator.value === 'is'
  ).map((operator) => ({
    ...operator,
    InputComponent: GridFilterInputSingleSelect,
    InputComponentProps: {
      valueOptions: getStatusValueOptions(),
      // Optionnel : personnaliser l'affichage des options
      getOptionLabel: (value) => STATUS_MAPPING[value] || `Statut ${value}`,
    },
  })),
  sx: {
    '& .MuiDataGrid-iconButtonContainer': {
      visibility: 'visible !important',
      opacity: '1 !important'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      justifyContent: 'center'
    },
  },
},
      {
        field: 'transfert',
        headerName: isMobile ? 'Transf.' : isTablet ? 'Transf.' : 'Transférer',
        headerAlign: 'center',
        width: isMobile ? 70 : isTablet ? 80 : 120,
        minWidth: isMobile ? 70 : isTablet ? 80 : 120,
        flex: 0,
        align: 'center',
        headerClassName: 'th-cell',
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
  }, [onPreview, openedRowRef, onFilterModelChange, isMobile, isTablet, filteredData, lockedQuotes]);



  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
  disableColumnSelector={true} 
  className="datatable"
  hideFooter={true}
  getRowClassName={(params) =>
    params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
  }
  

  slots={{
    
    columnMenuIcon: () => (
      <FontAwesomeIcon icon={faAngleDown}
        
        className="custom-menu-icon"
        style={{
          fontSize: '1rem',
          color: theme.palette.text.secondary,
          padding: '4px'
        }}
      />
    ),
  }}
  
   componentsProps={{
    columnMenu: {
      components: {
        Tooltip: () => null, // Désactive complètement le composant Tooltip
      }
    }
  }}
  
  sx={{
    width: '100%',
    height: isMobile ? 300 : isTablet ? 350 : 400,
    backgroundColor: '#ffffff',
    
    // NOUVEAU : Corriger la zone vide sous les lignes
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: '#ffffff', // Zone de contenu blanche
    },
    '& .MuiDataGrid-filler': {
      backgroundColor: '#ffffff', // Zone de remplissage blanche
    },
    '& .MuiDataGrid-overlayWrapper': {
      backgroundColor: '#ffffff', // Zone d'overlay blanche
    },
    
    '& .MuiDataGrid-main': { overflow: 'visible' },
    '& .MuiDataGrid-virtualScroller': { overflowX: 'auto', overflowY: 'auto' },
    '& .MuiDataGrid-columnHeaders': { minWidth: 'max-content' },
    '& .MuiDataGrid-row': { minWidth: 'max-content' },
    '& .MuiDataGrid-columnHeader': { minWidth: 'unset !important' },
    
    // Styles spécifiques pour forcer l'affichage de l'icône personnalisée
    '& .custom-menu-icon': {
      display: 'block !important',
      opacity: '1 !important',
      visibility: 'visible !important'
    },
    '& .MuiDataGrid-menuIcon': {
      width: 'auto !important',
      visibility: 'visible !important',
      '& button': {
        padding: '4px !important',
        '& svg:not(.custom-menu-icon)': {
          display: 'none !important' // Cache l'icône native
        }
      }
      
    },

    //couleurs des lignes

    '& .even-row': {
      backgroundColor: '#F5F2EE', // Gris clair pour les lignes paires
    },
    '& .odd-row': {
      backgroundColor: 'white', // Blanc pour les lignes impaires
    },
    
    // Supprimer les bordures entre les lignes
    '& .MuiDataGrid-row': {
      borderBottom: 'none !important',
    },
    // NOUVEAU : Changer l'arrière-plan
    backgroundColor: '#f0f0f0', 
  }}
/>
      </Box>
    </>
  );
}