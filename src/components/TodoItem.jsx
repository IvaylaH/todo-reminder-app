import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const STATUS_COLORS = {
  TODO: 'default',
  INPROGRESS: 'primary',
  DONE: 'success',
  CANCELLED: 'error',
};

function TodoItem({ todo, onEdit, onDelete }) {
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
              {todo.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Author:</strong> {todo.author}
              </Typography>
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
                onClick={() => onDelete(todo.id)}
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

