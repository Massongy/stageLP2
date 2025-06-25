// version du dashboard fonctionnel au 20/06/25 sans séparation tableau de données et prévisualisation

import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUnlock, faCircleArrowRight,  faArrowUpRightFromSquare, faCircleInfo, faEye} from '@fortawesome/free-solid-svg-icons';
import DropdownButton from './dropdownbutton.jsx'; // Assuming you have this component
const columns = [
  {
    field: 'lock',
    headerName: '',
    width: 90,
    renderCell: (params) => (
      
<FontAwesomeIcon icon={faUnlock} />
    ),
      sortable: false,
    filterable: false,
    disableColumnMenu: true,
   },
  {
    field: 'id',
    headerName: 'Référence',
    width: 180,
    renderHeader: () => (
      <Box  sx={{ pointerEvents: 'none' }}>
        Référence
        <DropdownButton
          options={[
          { label: 'Option 1', value: 'option1' },  
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }, ]}
          
          onSelect={(value) => console.log(value)}
          />
       
      </Box>
    ),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
   
  },
  { field: 'demande', headerName: 'Lien de la demande', width: 180, sortable: false, filterable: false },
  { field: 'scoring', headerName: 'Scoring', width: 120, sortable: false, filterable: false },
  {
    field: 'potentiel',
    headerName: 'Potentiel',
    width: 180,
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        Potentiel
        <DropdownButton
          options={[
          { label: 'Option 1', value: 'option1' },  
          { label: 'Tiède', value: 'option2' },
          { label: 'Froid', value: 'option3' }, ]}
          
          onSelect={(value) => console.log(value)}
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
    width: 150,
    renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        Statut
        <DropdownButton
          options={[
          { label: 'Répondu', value: 'option1' },  
          { label: 'En cours', value: 'option2' },
           ]}
          
          onSelect={(value) => console.log(value)}
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
    width: 120,
    renderCell: () => (
<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
    ),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'preview',
    headerName: '',
    width: 150,
    renderHeader: () => (<FontAwesomeIcon icon={faCircleInfo}
       />
    ),
    renderCell: (params) => (

      <FontAwesomeIcon icon={faCircleArrowRight} 
        onClick={() => params.row.onSelect(params.row.id)} />
     
    ),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];

const rawRows = [
   { id: 1, demande: 'Demande 1', scoring: '80', potentiel: '', statut: '', transfert: '', preview: '' },
  { id: 2, demande: 'Demande 2', scoring: '90', potentiel: '', statut: '', transfert: '', preview: '' },
];

// suite
function DataTable({ onSelect }) {
  const updatedRows = rawRows.map((r) => ({ ...r, onSelect }));
  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%' }}>
      <DataGrid rows={updatedRows} columns={columns} pageSize={5} disableRowSelectionOnClick />
    </Paper>
  );
}

function PreviewTabs({ selectedId }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!selectedId) {
    return (<Box sx={{
    display: 'flex',
    flexDirection: 'column',      // empile verticalement
    justifyContent: 'center',     // centre le long de l’axe principal (vertical ici)
    alignItems: 'center',         // centre horizontalement
    height: '100%',               // la Box doit avoir la hauteur définie
    minHeight: '100vh',
    }}
    >
    <FontAwesomeIcon icon={faEye} />
    <Typography>Onglet de prévisualisation
      Sélectionnez une demande pour voir les informations.
    </Typography>
    </Box>)
  }

  const handleTabChange = (e, v) => setActiveTab(v);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Détails" />
        <Tab label="Historique" />
        <Tab label="Paramètres" />
      </Tabs>
      <Paper elevation={1} sx={{ p: 2, height: 'calc(100% - 48px)' }}>
        {activeTab === 0 && <Typography>Détails de la référence {selectedId}</Typography>}
        {activeTab === 1 && <Typography>Historique de la référence {selectedId}</Typography>}
        {activeTab === 2 && <Typography>Paramètres de la référence {selectedId}</Typography>}
      </Paper>
    </Box>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 1175}}>
        <DataTable onSelect={handleSelect} />
      </Box>
      <Box sx={{ flex: 1}}>
        <PreviewTabs selectedId={selectedId} />
      </Box>
    </Box>
  );
}
