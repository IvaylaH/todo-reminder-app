import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { supabase } from '../config/supabase';

const STATUS_OPTIONS = ['TODO', 'INPROGRESS', 'DONE', 'CANCELLED'];

function EditTodoDialog({ open, todo, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author_id: '',
    assignee_id: '',
    deadline: null,
    status: 'TODO',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    if (todo) {
      setFormData({
        name: todo.name || '',
        description: todo.description || '',
        author_id: todo.author_id || '',
        assignee_id: todo.assignee_id || '',
        deadline: todo.deadline ? dayjs(todo.deadline) : null,
        status: todo.status || 'TODO',
      });
    }
  }, [todo]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('first_name', { ascending: true });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const todoData = {
        name: formData.name,
        description: formData.description,
        assignee_id: formData.assignee_id,
        deadline: formData.deadline ? formData.deadline.toISOString() : null,
        status: formData.status,
      };

      const { error: updateError } = await supabase
        .from('todos')
        .update(todoData)
        .eq('todo_id', todo.todo_id);

      if (updateError) throw updateError;
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update TODO item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit TODO Item</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                inputProps={{ maxLength: 1000 }}
                helperText={`${formData.description.length}/1000 characters`}
              />
              <TextField
                fullWidth
                select
                label="Author"
                name="author_id"
                value={formData.author_id}
                disabled={true}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Assignee"
                name="assignee_id"
                value={formData.assignee_id}
                onChange={handleChange}
                disabled={loadingUsers}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {loadingUsers ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading users...
                  </MenuItem>
                ) : (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))
                )}
              </TextField>
              <DateTimePicker
                label="Deadline"
                value={formData.deadline}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    deadline: newValue,
                  }))
                }
                slotProps={{
                  textField: { fullWidth: true },
                  popper: {
                    placement: 'top-start',
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ],
                  },
                }}
              />
              <TextField
                required
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default EditTodoDialog;

