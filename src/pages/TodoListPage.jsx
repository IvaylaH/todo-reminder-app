import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../config/supabase';
import TodoItem from '../components/TodoItem';
import AddTodoDialog from '../components/AddTodoDialog';
import EditTodoDialog from '../components/EditTodoDialog';

function TodoListPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTodos(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch TODO items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (todoId) => {
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('todo_id', todoId);

      if (deleteError) throw deleteError;
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to delete TODO item');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    fetchTodos();
  };

  const handleCloseEditDialog = () => {
    setEditingTodo(null);
    fetchTodos();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Back to Home
        </Button>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          variant="contained"
        >
          Add TODO
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        TODO List
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : todos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No TODO items yet. Create your first one!
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.todo_id}
              todo={todo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}

      <AddTodoDialog open={openAddDialog} onClose={handleCloseAddDialog} />
      {editingTodo && (
        <EditTodoDialog
          open={!!editingTodo}
          todo={editingTodo}
          onClose={handleCloseEditDialog}
        />
      )}
    </Box>
  );
}

export default TodoListPage;

