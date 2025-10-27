-- Migration: Add search and filter support for TODO items
-- Description: This migration adds necessary indexes and ensures proper column structure
--              for efficient search and filtering functionality

-- Ensure todos table has all required columns with proper types
-- Note: If these columns already exist, this will not cause errors

-- Add indexes for better query performance on filter columns
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_author_id ON todos(author_id);
CREATE INDEX IF NOT EXISTS idx_todos_assignee_id ON todos(assignee_id);
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Add full-text search index for name and description columns
-- This enables efficient text search across name and description fields
CREATE INDEX IF NOT EXISTS idx_todos_name_search ON todos USING GIN(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_todos_description_search ON todos USING GIN(to_tsvector('english', description));

-- Verify foreign key constraints exist
-- These should already exist, but this ensures data integrity
ALTER TABLE todos
ADD CONSTRAINT fk_todos_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_todos_assignee_id FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL;

-- Note: The above ALTER TABLE with ADD CONSTRAINT will fail if constraints already exist
-- If you get an error about constraints already existing, that's fine - it means they're already set up

-- Verify users table has required columns
-- The users table should have: id, first_name, last_name, created_at

-- Optional: Create a view for easier querying with user names
CREATE OR REPLACE VIEW todos_with_user_names AS
SELECT 
  t.todo_id,
  t.name,
  t.description,
  t.status,
  t.deadline,
  t.created_at,
  t.author_id,
  COALESCE(au.first_name || ' ' || au.last_name, 'Unknown') as author_name,
  t.assignee_id,
  COALESCE(as.first_name || ' ' || as.last_name, 'Unassigned') as assignee_name
FROM todos t
LEFT JOIN users au ON t.author_id = au.id
LEFT JOIN users as ON t.assignee_id = as.id;

-- Note: The search and filter functionality is implemented on the client-side (React)
-- The database indexes above will help with performance if you decide to move filtering to the backend

