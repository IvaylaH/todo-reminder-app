import { useState } from 'react';
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
import { supabase } from '../config/supabase';

const STATUS_OPTIONS = ['TODO', 'INPROGRESS', 'DONE', 'CANCELLED'];

function AddTodoDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    description: '',
    author: '',
    deadline: '',
    status: 'TODO',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const { error: insertError } = await supabase
        .from('todos')
        .insert([
          {
            description: formData.description,
            author: formData.author,
            deadline: formData.deadline || null,
            status: formData.status,
          },
        ]);

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        description: '',
        author: '',
        deadline: '',
        status: 'TODO',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create TODO item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      author: '',
      deadline: '',
      status: 'TODO',
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New TODO Item</DialogTitle>
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
            <TextField
              fullWidth
              label="Deadline"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
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
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddTodoDialog;

