import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { ThemeContext } from './context/ThemeContext';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#32CD32', // Lime Green
    },
    secondary: {
      main: '#FF8C00', // Orange
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            backgroundColor: '#32CD32',
            opacity: 0.7,
          },
        },
        text: {
          '&:hover': {
            opacity: 0.7,
          },
        },
        outlined: {
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#333333',
          '&.Mui-selected': {
            backgroundColor: '#32CD32',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#5FFF5F',
            },
          },
          '&.MuiPickersDay-today': {
            borderColor: '#32CD32',
            color: '#333333',
          },
        },
      },
    },
    MuiClockNumber: {
      styleOverrides: {
        root: {
          color: '#333333',
          '&.Mui-selected': {
            color: '#32CD32',
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        pin: {
          backgroundColor: '#32CD32',
        },
        hand: {
          backgroundColor: '#32CD32',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          color: '#333333',
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#32CD32',
          color: '#ffffff',
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#333333',
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            marginTop: '-10px',
            maxHeight: '350px',
            overflowY: 'auto',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9370DB', // Plum/Purple
    },
    secondary: {
      main: '#FFD700', // Yellow
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#cccccc',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            backgroundColor: '#9370DB',
            opacity: 0.7,
          },
        },
        text: {
          '&:hover': {
            opacity: 0.7,
          },
        },
        outlined: {
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#cccccc',
          '&.Mui-selected': {
            backgroundColor: '#9370DB',
            color: '#cccccc',
            '&:hover': {
              backgroundColor: '#B89FD9',
            },
          },
          '&.MuiPickersDay-today': {
            borderColor: '#9370DB',
            color: '#cccccc',
          },
        },
      },
    },
    MuiClockNumber: {
      styleOverrides: {
        root: {
          color: '#cccccc',
          '&.Mui-selected': {
            color: '#9370DB',
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        pin: {
          backgroundColor: '#9370DB',
        },
        hand: {
          backgroundColor: '#9370DB',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          color: '#cccccc',
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#9370DB',
          color: '#cccccc',
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#cccccc',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#cccccc',
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            marginTop: '-10px',
            maxHeight: '350px',
            overflowY: 'auto',
          },
        },
      },
    },
  },
});

function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);

