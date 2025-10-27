import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddTodoDialog from '../components/AddTodoDialog';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
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
    border: `3px dashed ${theme.palette.primary.main}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light'
        ? 'rgba(50, 205, 50, 0.08)'
        : 'rgba(147, 112, 219, 0.08)',
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
          <ListAltIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            TODO List
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={squareStyle}
          onClick={handleOpenDialog}
        >
          <AddIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            New TODO Item
          </Typography>
        </Paper>
      </Box>

      <AddTodoDialog open={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default HomePage;

