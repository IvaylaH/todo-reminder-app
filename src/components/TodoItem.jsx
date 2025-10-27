import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../config/supabase';

const STATUS_COLORS = {
  TODO: 'default',
  INPROGRESS: 'primary',
  DONE: 'success',
  CANCELLED: 'error',
};

function TodoItem({ todo, onEdit, onDelete }) {
  const [authorName, setAuthorName] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [loadingAuthor, setLoadingAuthor] = useState(false);
  const [loadingAssignee, setLoadingAssignee] = useState(false);

  useEffect(() => {
    if (todo.author_id) {
      fetchAuthorName();
    }
  }, [todo.author_id]);

  useEffect(() => {
    if (todo.assignee_id) {
      fetchAssigneeName();
    }
  }, [todo.assignee_id]);

  const fetchAuthorName = async () => {
    try {
      setLoadingAuthor(true);
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', todo.author_id)
        .single();

      if (error) throw error;
      if (data) {
        setAuthorName(`${data.first_name} ${data.last_name}`);
      }
    } catch (err) {
      console.error('Failed to fetch author:', err.message);
      setAuthorName('Unknown Author');
    } finally {
      setLoadingAuthor(false);
    }
  };

  const fetchAssigneeName = async () => {
    try {
      setLoadingAssignee(true);
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', todo.assignee_id)
        .single();

      if (error) throw error;
      if (data) {
        setAssigneeName(`${data.first_name} ${data.last_name}`);
      }
    } catch (err) {
      console.error('Failed to fetch assignee:', err.message);
      setAssigneeName('Unknown Assignee');
    } finally {
      setLoadingAssignee(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={todo.status}
                color={STATUS_COLORS[todo.status]}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                Created: {formatCreatedAt(todo.created_at)}
              </Typography>
            </Box>
            <Typography variant="h6" component="div" gutterBottom>
              {todo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {todo.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Author:</strong> {loadingAuthor ? <CircularProgress size={16} sx={{ ml: 1 }} /> : authorName}
              </Typography>
              {todo.assignee_id && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Assignee:</strong> {loadingAssignee ? <CircularProgress size={16} sx={{ ml: 1 }} /> : assigneeName}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Deadline:</strong> {formatDate(todo.deadline)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => onEdit(todo)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => onDelete(todo.todo_id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TodoItem;

