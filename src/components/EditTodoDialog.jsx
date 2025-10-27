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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { supabase } from '../config/supabase';

const STATUS_OPTIONS = ['TODO', 'INPROGRESS', 'DONE', 'CANCELLED'];

function EditTodoDialog({ open, todo, onClose }) {
  const [formData, setFormData] = useState({
    description: '',
    author: '',
    deadline: null,
    status: 'TODO',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        description: todo.description || '',
        author: todo.author || '',
        deadline: todo.deadline ? dayjs(todo.deadline) : null,
        status: todo.status || 'TODO',
      });
    }
  }, [todo]);

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
      const { error: updateError } = await supabase
        .from('todos')
        .update({
          description: formData.description,
          author: formData.author,
          deadline: formData.deadline ? formData.deadline.toISOString() : null,
          status: formData.status,
        })
        .eq('id', todo.id);

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
                required
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                inputProps={{ maxLength: 200 }}
              />
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

