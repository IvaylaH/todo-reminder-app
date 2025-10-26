# TODO List Application

A modern TODO list application built with React, Material-UI, and Supabase.

## Features

- ✅ Create, Read, Update, and Delete TODO items
- 🎨 Clean and modern UI with Material-UI components
- 📱 Responsive design
- 🗄️ PostgreSQL database via Supabase
- ⚡ Real-time data synchronization
- 🎯 Status tracking (TODO, IN PROGRESS, DONE, CANCELLED)
- 📅 Deadline management
- 👤 Author tracking

## Tech Stack

- **Frontend**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Emotion (CSS-in-JS)

## Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── AddTodoDialog.jsx      # Dialog for creating new TODOs
│   │   ├── EditTodoDialog.jsx     # Dialog for editing existing TODOs
│   │   └── TodoItem.jsx            # Individual TODO item card
│   ├── pages/
│   │   ├── HomePage.jsx            # Landing page with two action buttons
│   │   └── TodoListPage.jsx        # Main TODO list view
│   ├── config/
│   │   └── supabase.js             # Supabase client configuration
│   ├── App.jsx                     # Main app component with routing
│   └── main.jsx                    # Application entry point
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── SUPABASE_SETUP.md              # Detailed Supabase setup guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Follow the instructions in `SUPABASE_SETUP.md` to create your Supabase project and database table

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Usage

### Home Page

The home page features two interactive buttons:

1. **TODO List** - View all your TODO items
2. **+ Add New TODO Item** - Quick access to create a new TODO

### Creating a TODO

1. Click the "+ Add New TODO Item" button on the home page or the "Add TODO" button on the list page
2. Fill in the form:
   - **Description** (required): What needs to be done
   - **Author** (required): Who is responsible
   - **Deadline** (optional): When it should be completed
   - **Status** (required): Current status (defaults to TODO)
3. Click "Create"

### Viewing TODOs

- Navigate to the TODO List page to see all items
- Items are sorted by creation date (newest first)
- Each item displays:
  - Status badge with color coding
  - Creation timestamp
  - Description
  - Author
  - Deadline

### Editing a TODO

1. Click the edit icon (pencil) on any TODO item
2. Modify the fields as needed
3. Click "Update" to save changes

### Deleting a TODO

- Click the delete icon (trash) on any TODO item
- The item will be permanently removed

## Status Options

- **TODO**: Not started yet (gray)
- **INPROGRESS**: Currently being worked on (blue)
- **DONE**: Completed (green)
- **CANCELLED**: No longer needed (red)

## Database Schema

The application uses a single `todos` table with the following structure:

| Column      | Type          | Description                          |
|-------------|---------------|--------------------------------------|
| id          | SERIAL        | Auto-incrementing primary key        |
| created_at  | TIMESTAMPTZ   | Timestamp when TODO was created      |
| description | VARCHAR(1000) | TODO description/details             |
| author      | VARCHAR(200)  | Person responsible for the TODO      |
| deadline    | TIMESTAMPTZ   | Optional deadline                    |
| status      | VARCHAR(20)   | Current status (enum)                |

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Future Enhancements

Potential features to add:

- User authentication
- TODO categories/tags
- Search and filter functionality
- Sort options
- Priority levels
- Attachments
- Comments/notes
- Due date notifications
- Dark mode

## License

MIT

