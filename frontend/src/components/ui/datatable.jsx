import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faArrowUpRightFromSquare, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './DropDownButton';
import PreviewButtonCell from './PreviewButtonCell';
import '../../assets/DataTable.css';


export default function DataTable({data, onPreview, openedRowRef, filterModel, onFilterModelChange }) {
 
  const theme = useTheme();
  
  // Breakpoints responsives
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  
  // Colonnes adaptatives selon la taille d'écran
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        field: 'lock',
        headerName: '',
        headerAlign: 'center',
        width: isMobile ? 60 : 100,
        align: 'center',
        renderCell: () => <FontAwesomeIcon icon={faUnlock} className="icone-datatable" />,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      },
      {
        field: 'reference_id_SI',
        headerName: 'Référence',
        headerAlign: 'center',
        width: isMobile ? 80 : isTablet ? 120 : 154,
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
      },
      { 
        field: 'demande', 
        headerName: isMobile ? 'Demande' : 'Lien de la demande', 
        headerAlign: 'center', 
        width: isMobile ? 120 : isTablet ? 180 : 255, 
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true 
      },
      { 
        field: 'scoring', 
        headerName: 'Score', 
        headerAlign: 'center', 
        width: isMobile ? 60 : 102, 
        align: 'center', 
        sortable: false, 
        filterable: false, 
        disableColumnMenu: true 
      },
      {
        field: 'potentiel',
        headerName: 'Potentiel',
        width: isMobile ? 90 : isTablet ? 150 : 205,
        renderHeader: () => (
          <Box className="th-cell-dropdown">
            Potentiel
            <DropdownButton
              options={[
                { label: 'Tous', value: '' },
                { label: 'Chaud', value: 'Chaud' },
                { label: 'Tiède', value: 'Tiède' },
                { label: 'Froid', value: 'Froid' },
              ]}
              onSelect={(value) => {
                onFilterModelChange({
                  items: value
                    ? [{ id: 1, field: 'potentiel', operator: 'equals', value }]
                    : [],
                });
              }}
            />
          </Box>
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      },
      {
        field: 'statut',
        headerName: 'Statut',
        headerAlign: 'center',
        width: isMobile ? 80 : 103,
        align: 'center',
        renderHeader: () => (
          <Box className="th-cell-dropdown">
            Statut
            <DropdownButton
              options={[
                { label: 'Répondu', value: 'Répondu' },
                { label: 'En cours', value: 'En cours' },
              ]}
            />
          </Box>
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      }
    ];

    // Colonnes conditionnelles selon la taille d'écran
    if (!isMobile) {
      baseColumns.push({
        field: 'transfert',
        headerName: isTablet ? 'Transf.' : 'Transférer',
        headerAlign: 'center',
        width: isTablet ? 80 : 154,
        align: 'center',
        renderCell: () => (
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            style={{ cursor: 'pointer' }}
            className="icone-datatable"
          />
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      });
    }

    // Colonne preview toujours présente
    baseColumns.push({
      field: 'preview',
      headerName: '',
      width: isMobile ? 60 : 102,
      align: 'center',
      renderHeader: () => <FontAwesomeIcon icon={faCircleInfo} className="icone-datatable icone-datatable-info" />,
      renderCell: (params) => (
        <PreviewButtonCell row={params.row} isOpen={params.row.reference_id_SI === openedRowRef} onToggle={onPreview} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    });

    return baseColumns;
  }, [onPreview, openedRowRef, onFilterModelChange, isMobile, isTablet]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: 400,
      '& .MuiDataGrid-root': {
        border: 'none',
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
      // Responsive adjustments
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
        rows={data}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        pageSize={isMobile ? 3 : isTablet ? 5 : 10}
        rowsPerPageOptions={isMobile ? [3, 5] : isTablet ? [5, 10] : [5, 10, 25]}
        disableRowSelectionOnClick
        className="datatable"
        sx={{
          // Scroll horizontal sur mobile
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'auto',
          },
          // Hauteur adaptative
          height: isMobile ? 300 : isTablet ? 350 : 400,
        }}
      />
    </Box>
  );
}