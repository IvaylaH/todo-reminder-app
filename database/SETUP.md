# Database Setup for Search and Filter Functionality

## Overview

The TODO application now includes search and filter functionality. This document explains the database setup required to support these features.

## Current Implementation

The search and filter functionality is implemented **client-side** in React, which means:
- All filtering happens in the browser after data is fetched
- No additional database queries are needed for filtering
- The application fetches all TODOs and filters them locally

## Database Optimization (Optional)

While the current implementation works well for small to medium datasets, you can optimize the database for better performance with large datasets by running the migration script.

### Running the Migration

1. **Using Supabase Dashboard:**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Create a new query
   - Copy the contents of `migrations/add_search_filter_support.sql`
   - Run the query

2. **Using Supabase CLI:**
   ```bash
   supabase db push
   ```

### What the Migration Does

The migration script (`migrations/add_search_filter_support.sql`) creates:

1. **Indexes for filtering:**
   - `idx_todos_status` - Speeds up status filtering
   - `idx_todos_author_id` - Speeds up author filtering
   - `idx_todos_assignee_id` - Speeds up assignee filtering
   - `idx_todos_deadline` - Speeds up deadline filtering
   - `idx_todos_created_at` - Speeds up sorting by creation date

2. **Full-text search indexes:**
   - `idx_todos_name_search` - Enables efficient text search on name
   - `idx_todos_description_search` - Enables efficient text search on description

3. **Foreign key constraints:**
   - Ensures data integrity between todos and users tables
   - Automatically handles cascading deletes if needed

4. **View for easier querying:**
   - `todos_with_user_names` - A view that joins todos with user names for easier backend queries

## Database Schema Requirements

The application expects the following table structures:

### todos table
```sql
CREATE TABLE todos (
  todo_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  author_id BIGINT NOT NULL REFERENCES users(id),
  assignee_id BIGINT REFERENCES users(id),
  deadline TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'TODO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### users table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Filter and Search Features

### Search
- Searches in both `name` and `description` fields
- Case-insensitive
- Partial matching (e.g., searching "test" will find "testing")

### Filters
1. **Status Filter** - Filter by TODO status (TODO, In Progress, Done, Cancelled)
2. **Author Filter** - Filter by who created the TODO
3. **Assignee Filter** - Filter by who is assigned to the TODO
4. **Deadline Filter** - Filter by whether a deadline exists or not

### Combining Filters
All filters work together - you can apply multiple filters at once to narrow down results.

## Performance Considerations

- **Small datasets (< 1000 items):** Client-side filtering is sufficient
- **Medium datasets (1000-10000 items):** Consider running the migration for better performance
- **Large datasets (> 10000 items):** Consider moving filtering to the backend using the provided indexes

## Future Enhancements

To move filtering to the backend:
1. Create API endpoints that accept filter parameters
2. Use the database indexes to efficiently query filtered results
3. Return only the filtered results to the client
4. Update the React components to call these new endpoints

This would reduce the amount of data transferred and improve performance for very large datasets.

