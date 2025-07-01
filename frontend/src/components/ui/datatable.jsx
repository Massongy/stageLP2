import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faArrowUpRightFromSquare, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './dropdownbutton';
import PreviewButtonCell from './previewbuttoncell';
import '../../assets/datatable.css';
import { authFetch } from '../../services/auth.js';

export default function DataTable({ onPreview, openedRowId, filterModel, onFilterModelChange }) {
//constante rows en fonction de l'état détermineé par setRows
  const [rows, setRows] = useState([]);

  useEffect(() => {
    /* déclarer la fonction */
    async function fetchData() {
      try {
        const res = await authFetch('/api/questionnaire/questions'); //utilise la fonction authFetch avec l'url adéquat : cette fonctiona ajoute le token à la requete
        if (res && res.ok) {
          const data = await res.json();
          console.log(data);
            // récupere les data et les mets en forme
          const formattedData = data.map((item, index) => ({
            id: item.id || index, 
            demande: item.demande || '',
            scoring: item.scoring || '',
            potentiel: item.potentiel || '',
            statut: item.statut || '',
            transfert: '',
            preview: ''

        }));
        setRows([
    {
      id: 1,
      demande: 'Test demande',
      scoring: '85',
      potentiel: 'Chaud',
      statut: 'Répondu',
      transfert: '',
      preview: ''
    }]);
        } else {
          console.error('Erreur API', res?.status);
        }
      } catch (error) {
        console.error('Erreur de chargement des données :', error);
      }
    }
    /*utiliser la fonction */
    fetchData();
  }, []);

  const columns = React.useMemo(() => [
    {
      field: 'lock',
      headerName: '',
      headerAlign: 'center',
      width: 100,
      align: 'center',
      renderCell: () => <FontAwesomeIcon icon={faUnlock} className="icone-datatable" />,
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
    { field: 'demande', headerName: 'Lien de la demande', headerAlign: 'center', width: 255, align: 'center', sortable: false, filterable: false, disableColumnMenu: true },
    { field: 'scoring', headerName: 'Scoring', headerAlign: 'center', width: 102, align: 'center', sortable: false, filterable: false, disableColumnMenu: true },
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
      width: 103,
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
    },
    {
      field: 'transfert',
      headerName: 'Transférer',
      headerAlign: 'center',
      width: 154,
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
    },
    {
      field: 'preview',
      headerName: '',
      width: 102,
      align: 'center',
      renderHeader: () => <FontAwesomeIcon icon={faCircleInfo} className="icone-datatable icone-datatable-info" />,
      renderCell: (params) => (
        <PreviewButtonCell row={params.row} isOpen={params.row.id === openedRowId} onToggle={onPreview} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ], [onPreview, openedRowId, onFilterModelChange]);

  
  
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      filterModel={filterModel}
      onFilterModelChange={onFilterModelChange}
      pageSize={5}
      disableRowSelectionOnClick
      className="datatable"
    />
  );
}
