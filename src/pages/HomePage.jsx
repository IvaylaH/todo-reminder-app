import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddTodoDialog from '../components/AddTodoDialog';

function HomePage() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNavigateToTodos = () => {
    navigate('/todos');
  };

  const squareStyle = {
    width: '300px',
    height: '300px',
    border: '3px dashed #1976d2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'scale(1.05)',
    },
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexWrap: 'wrap',
        }}
      >
        <Paper
          elevation={0}
          sx={squareStyle}
          onClick={handleNavigateToTodos}
        >
          <ListAltIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            TODO List
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={squareStyle}
          onClick={handleOpenDialog}
        >
          <AddIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            + Add New TODO Item
          </Typography>
        </Paper>
      </Box>

      <AddTodoDialog open={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default HomePage;

