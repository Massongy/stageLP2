// src/components/DataTable/DataTable.jsx
import React from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faArrowUpRightFromSquare, faCircleArrowRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './dropdownbutton';
import PreviewButtonCell from './previewbuttoncell';
import '../../assets/datatable.css'


  


const rawRows = [
{ id: 1, demande: 'https://mail.google', scoring: '80', potentiel: 'Tiède', statut: 'Répondu', transfert: '', preview: '' },
{ id: 2, demande: 'Demande 2', scoring: '90', potentiel: 'Tiède', statut: 'En cours', transfert: '', preview: '' },
{ id: 3, demande: 'Demande 3', scoring: '90', potentiel: 'Froid', statut: 'En cours', transfert: '', preview: '' },
{ id: 4, demande: 'Demande 4', scoring: '90', potentiel: 'Froid', statut: 'En cours', transfert: '', preview: '' },
{ id: 5, demande: 'Demande 5', scoring: '90', potentiel: 'Chaud', statut: 'Répondu', transfert: '', preview: '' },
{ id: 6, demande: 'Demande 6', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 7, demande: 'Demande 7', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 8, demande: 'Demande 8', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 9, demande: 'Demande 9', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 10, demande: 'Demande 10', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 11, demande: 'Demande 11', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 12, demande: 'Demande 12', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 13, demande: 'Demande 4', scoring: '90', potentiel: 'Froid', statut: 'En cours', transfert: '', preview: '' },
{ id: 14, demande: 'Demande 5', scoring: '90', potentiel: 'Chaud', statut: 'Répondu', transfert: '', preview: '' },
{ id: 15, demande: 'Demande 6', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 16, demande: 'Demande 7', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 17, demande: 'Demande 8', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 18, demande: 'Demande 9', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 19, demande: 'Demande 10', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
{ id: 20, demande: 'Demande 11', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },


];


export default function DataTable({ onPreview, openedRowId, filterModel, onFilterModelChange}) {
  


 const columns = React.useMemo(() => [
    {
    field: 'lock',
    headerName: '',
     headerAlign: 'center',
    width: 100,
align: 'center',
    renderCell: (params) => (
      
<FontAwesomeIcon icon={faUnlock} className="icone-datatable"/>
    ),
      sortable: false,
    filterable: false,
    disableColumnMenu: true,
   },
  {
    field: 'id',
    headerName: 'Référence',
     headerAlign: 'center',
    width: 154,
    align: 'center',
    renderHeader: () => (
      <Box className="th-cell-dropdown">
        Référence
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
  { field: 'demande', headerName: 'Lien de la demande',  headerAlign: 'center', width: 255, align: 'center', sortable: false, filterable: false, disableColumnMenu: true },
  { field: 'scoring', headerName: 'Scoring',  headerAlign: 'center', width: 102, align: 'center', sortable: false, filterable: false, disableColumnMenu: true },
   {
    field: 'potentiel',
    headerName: 'Potentiel',
    width: 205,
    renderHeader: () => (

      
        <Box className="th-cell-dropdown">
          Potentiel
          <DropdownButton
            options={[
              { label: 'Tous', value: '' },
              { label: 'Chaud', value: 'chaud' },
              { label: 'Tiède', value: 'tiède' },
              { label: 'Froid', value: 'froid' },
            ]}
            onSelect={(value) => {
              onFilterModelChange({
                items: value
                  ? [{ id: 1, field: 'potentiel', operator: 'equals', value }]
                  : []
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
    width: 103,
    align: 'center',
    renderHeader: () => (
      <Box className="th-cell-dropdown">
        Statut
        <DropdownButton
          options={[
          { label: 'Répondu', value: 'option1' },  
          { label: 'En cours', value: 'option2' },
           ]}
          
        
          />
      </Box>
    ),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'transfert',
    headerName: 'Transférer',
     headerAlign: 'center',
    width: 154,
    align: 'center',
    renderCell: () => (
<FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ cursor: 'pointer'  }}
className="icone-datatable" />
    ),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
    {
      field: 'preview',
      headerName: '',
      width: 102,
      align: 'center',
      renderHeader: () => (
        <FontAwesomeIcon icon={faCircleInfo} className="icone-datatable icone-datatable-info" />
      ),
      renderCell: (params) => (
        <PreviewButtonCell
          row={params.row}
          isOpen={params.row.id === openedRowId}
          onToggle={onPreview}
        />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    }
  ], [onPreview, openedRowId]);

  
  const updatedRows = rawRows.map((r) => ({ ...r, onPreview }));
  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%' }}>
      <DataGrid rows={updatedRows} columns={columns} filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        pageSize={5} disableRowSelectionOnClick 
        className="datatable"
         sx={{
    '& .MuiDataGrid-virtualScroller': {
      overflowY: 'scroll',
      overflowX: 'auto',
    }
  }}/>
    </Paper>
  );
  
}
