import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../config/supabase';
import TodoItem from '../components/TodoItem';
import AddTodoDialog from '../components/AddTodoDialog';
import EditTodoDialog from '../components/EditTodoDialog';

const STATUS_OPTIONS = ['TODO', 'INPROGRESS', 'DONE', 'CANCELLED'];

const STATUS_LABELS = {
  TODO: 'TODO',
  INPROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

function TodoListPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterDeadline, setFilterDeadline] = useState('');

  const fetchUsers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('first_name', { ascending: true });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err.message);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAllTodos(data || []);
      setTodos(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch TODO items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTodos();
  }, []);

  const applyFiltersAndSearch = () => {
    let filtered = [...allTodos];

    // Search filter
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.name.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((todo) => todo.status === filterStatus);
    }

    // Author filter
    if (filterAuthor) {
      filtered = filtered.filter((todo) => todo.author_id === parseInt(filterAuthor));
    }

    // Assignee filter
    if (filterAssignee) {
      filtered = filtered.filter((todo) => todo.assignee_id === parseInt(filterAssignee));
    }

    // Deadline filter
    if (filterDeadline) {
      filtered = filtered.filter((todo) => {
        if (filterDeadline === 'no-deadline') {
          return !todo.deadline;
        } else if (filterDeadline === 'has-deadline') {
          return !!todo.deadline;
        }
        return true;
      });
    }

    setTodos(filtered);
  };

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchText, filterStatus, filterAuthor, filterAssignee, filterDeadline, allTodos]);

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
        My Todos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name or description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {STATUS_LABELS[option]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Author"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Authors</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Assignee"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Assignees</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Deadline"
            value={filterDeadline}
            onChange={(e) => setFilterDeadline(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Deadlines</MenuItem>
            <MenuItem value="has-deadline">Has Deadline</MenuItem>
            <MenuItem value="no-deadline">No Deadline</MenuItem>
          </TextField>
        </Box>
      </Box>

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

