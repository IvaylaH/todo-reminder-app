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
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearIcon from '@mui/icons-material/Clear';
import { supabase } from '../config/supabase';

const STATUS_COLORS = {
  TODO: 'default',
  INPROGRESS: 'primary',
  DONE: 'success',
  CANCELLED: 'error',
};

const STATUS_LABELS = {
  TODO: 'TODO',
  INPROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

function TodoItem({ todo, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
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
    if (!dateString) return null;
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

  const deadlineText = formatDate(todo.deadline);

  return (
    <Card sx={{ mb: expanded ? 1 : 2 }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Collapsed View */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
              <Chip
                label={STATUS_LABELS[todo.status]}
                color={STATUS_COLORS[todo.status]}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
                <strong>Author:</strong>{' '}
                <span style={{ color: '#32CD32' }}>
                  {loadingAuthor ? <CircularProgress size={14} sx={{ ml: 0.5 }} /> : authorName}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
                <strong>Deadline:</strong>{' '}
                <span style={{ color: '#32CD32' }}>
                  {deadlineText ? deadlineText : <ClearIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />}
                </span>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
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
                sx={{
                  color: '#D46C3A',
                  '&:hover': {
                    backgroundColor: 'rgba(160, 82, 45, 0.1)',
                  },
                }}
                onClick={() => onDelete(todo.todo_id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Expanded View */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              {todo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {todo.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {todo.assignee_id && (
                <Typography variant="body2">
                  <strong>Assignee:</strong>{' '}
                  <span style={{ color: '#32CD32' }}>
                    {loadingAssignee ? <CircularProgress size={14} sx={{ ml: 0.5 }} /> : assigneeName}
                  </span>
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Created: {formatCreatedAt(todo.created_at)}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default TodoItem;

