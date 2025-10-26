# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - Project name: `todo-app` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select the closest region to you
5. Click "Create new project" and wait for it to initialize

## 2. Create the TODOs Table

1. In your Supabase project dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste the following SQL code:

```sql
-- Create the todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description VARCHAR(1000) NOT NULL,
  author VARCHAR(200) NOT NULL,
  deadline TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'INPROGRESS', 'DONE', 'CANCELLED'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can make this more restrictive later)
CREATE POLICY "Enable all operations for todos table" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an index on created_at for better query performance
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX idx_todos_status ON todos(status);
```

4. Click "Run" to execute the SQL
5. You should see a success message

## 3. Get Your API Credentials

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll find two important values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon public key**: This is your `VITE_SUPABASE_ANON_KEY`

## 4. Configure Your Application

1. In your project root, create a `.env` file (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from step 3

## 5. Verify the Setup

You can verify the table was created correctly by:

1. Going to **Table Editor** in the Supabase dashboard
2. You should see the `todos` table listed
3. Click on it to view the structure

## Table Schema

The `todos` table has the following columns:

| Column       | Type          | Constraints                                      |
|------------- |---------------|--------------------------------------------------|
| id           | SERIAL        | PRIMARY KEY, auto-incrementing                   |
| created_at   | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()                          |
| description  | VARCHAR(1000) | NOT NULL                                         |
| author       | VARCHAR(200)  | NOT NULL                                         |
| deadline     | TIMESTAMPTZ   | NULL (optional)                                  |
| status       | VARCHAR(20)   | NOT NULL, DEFAULT 'TODO', CHECK constraint       |

## Security Notes

The current RLS policy allows all operations without authentication. For a production application, you should:

1. Enable Supabase Authentication
2. Update the RLS policies to restrict access based on authenticated users
3. Consider adding user_id column to track which user created each TODO

## Next Steps

After completing the setup:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser and test the application

