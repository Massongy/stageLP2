import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery, Menu, MenuItem, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Snackbar } from '@mui/material';
import { faLock, faUnlock, faCircleInfo, faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import StatusFilterButton from './StatusFilterButton';
import PreviewButtonCell from './PreviewButtonCell';
import ConfirmTransferIcon from './ConfirmTransferIcone';
import { useEditQuote } from '../../hooks/useEditQuote';
import { useGetLockedQuotes } from '../../hooks/useGetLockedQuotes';

import '../../assets/datatable.css';


export default function DataTable({data, onPreview, openedRowRef, filterModel, onFilterModelChange }) {

  const [statusFilter, setStatusFilter] = useState(null);
  
  // Appliquer le filtre de statut côté client
  const getFilteredData = () => {
    let filtered = (data || []).filter(quote => quote.status !== 5);
    
    if (statusFilter !== null && statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }
    
    return filtered;
  };
  
  const filteredData = getFilteredData();
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
      refetchQuotes()
    } catch (error) {
      setMessage(`Erreur lors du transfert : ${error.message}`);
      setMessageType('error');
      setOpenSnackbar(true);
    }
  };

  // Génération dynamique des valueOptions basée sur les données réelles
  const getStatusValueOptions = () => {
    const allData = (data || []).filter(quote => quote.status !== 5);
    const uniqueStatusesInData = [...new Set(allData.map(item => item.status).filter(status => status != null))];
    return uniqueStatusesInData.map(status => ({
      value: Number(status),
      label: STATUS_MAPPING[status] || `Statut ${status}`
    }));
  };

  // Colonnes adaptatives selon la taille d'écran
  const columns = React.useMemo(() => {
    const statusOptions = getStatusValueOptions();
    
    const baseColumns = [
      {
        field: 'lock',
        headerName: '',
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
          const isLocked = lockedQuotes.some(lockedQuote => lockedQuote.quote === params.row.id);
          return (
            <FontAwesomeIcon 
              icon={isLocked ? faLock : faUnlock} 
              className="icone-datatable" 
              style={{ color: isLocked ? undefined : '#656565' }}
            />
          );
        },
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      },
      {
        field: 'reference',
        headerName: 'Référence',
        headerAlign: 'center',
        width: '130',
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
        align: 'center', 
        width: '130',
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
        align: 'center', 
        width: '130',
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true,
        hideable: false,
        headerClassName: 'th-cell',
      },
      {
  field: 'status',
  headerName: 'Statut',
   renderHeader: (params) => ( <Box className="en-tete-colonne-statut" component="span" >
      Statut
      <StatusFilterButton 
        statusOptions={statusOptions}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
    </Box>
  ),
  
  type: 'number',
  headerAlign: 'center',
  align: 'center',
  width: '130',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  hideable: false,
  headerClassName: 'th-cell',
  valueFormatter: (params) => STATUS_MAPPING[params.value] || `Statut ${params.value}`,
  renderCell: (params) => (
    <span>{STATUS_MAPPING[params.value] || `Statut ${params.value}`}</span>
  ),
},
      {
        field: 'transfert',
        headerName: isMobile ? 'Transf.' : isTablet ? 'Transf.' : 'Transférer',
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'th-cell',
        renderCell: (params) => (
          <ConfirmTransferIcon
            row={params.row}
            onConfirm={(id) => handleTransfer(id)}
          />
        ),
        width: '100',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      },
      {
        field: 'preview',
        headerName: '',
        align: 'center',
        renderHeader: () => <FontAwesomeIcon icon={faCircleInfo} className="icone-datatable icone-datatable-info" />,
        renderCell: (params) => (
          <PreviewButtonCell row={params.row} isOpen={params.row.reference === openedRowRef} onToggle={onPreview} />
        ),
        width: '80',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
      }
    ];

    return baseColumns;
  }, [onPreview, openedRowRef, onFilterModelChange, isMobile, isTablet, filteredData, lockedQuotes, statusFilter]);

  const containerRef = React.useRef();

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          severity={messageType}
          className="alert"sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Box ref={containerRef} 
        sx={{ 
          display: 'flex',
          width: '100%', 
          height: '800px', 
          overflow: 'hidden',
        }}>
        
        <DataGrid
          rows={filteredData}
          columns={columns}
          headerHeight={70}
          rowHeight={70}
          // Suppression des props filterModel car on gère le filtrage manuellement
          disableRowSelectionOnClick
          disableColumnSelector={true} 
          className="datatable"
          hideFooter={true}
          getRowClassName={(params) => {
            const isRowOpen = params.row.reference === openedRowRef;
            if (isRowOpen) {
              return 'opened-row';
            }
            return params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row';
          }}

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
                Tooltip: () => null,
              }
            }
          }}
          
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiDataGrid-virtualScroller': {
              overflowY: 'auto',
            },
            backgroundColor: '#ffffff',
            '& .MuiDataGrid-main': { overflow: 'visible' },
            
            '& .MuiDataGrid-filler': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-overlayWrapper': {
              backgroundColor: '#ffffff',
            },
            
            '& .MuiDataGrid-columnHeaders': {
              height: '70px !important',
              padding: '0 !important', 
              minHeight: '70px !important',
            },
            
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
                  display: 'none !important'
                }
              }
            },

            '& .opened-row': {
              backgroundColor: '#D4C7B5',
            },

            '& .even-row': {
              backgroundColor: '#F5F2EE',
            },
            '& .odd-row': {
              backgroundColor: 'white',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#D4C7B5 !important',
            },
            
            '& .MuiDataGrid-row': {
              borderBottom: 'none !important',
            },

            '& .MuiDataGrid-virtualScroller': {
              overflowY: 'scroll !important',
              minHeight: '100px',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#D4C7B5 !important',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F5F2EE !important'
              }
            },
            '& .MuiDataGrid-main': {
              overflow: 'hidden !important'
            }
          }}
        />
      </Box>
    </>
  );
}