import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Theme inspired by Railway.app's sleek dark UI
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Primary brand color
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    // Railway-inspired dark theme colors
    gray: {
      50: '#f9fafb',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#121212', // Main background color (deeper than Chakra's default)
      950: '#0a0a0a', // Deepest shade for cards and containers
    },
    accent: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#1976d2', // Accent color - darker blue
      600: '#1565c0',
      700: '#0d47a1',
      800: '#0a3880',
      900: '#072a60',
    },
    success: {
      500: '#10b981', // Success green
    },
    danger: {
      500: '#ef4444', // Danger red
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
        lineHeight: 'tall',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        primary: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            _disabled: {
              bg: 'primary.500',
            },
          },
          _active: {
            bg: 'primary.700',
          },
        },
        secondary: {
          bg: 'gray.800',
          color: 'white',
          _hover: {
            bg: 'gray.700',
          },
          _active: {
            bg: 'gray.600',
          },
        },
        outline: {
          borderColor: 'gray.600',
          color: 'white',
          _hover: {
            bg: 'rgba(255,255,255,0.05)',
          },
        },
        ghost: {
          color: 'gray.300',
          _hover: {
            bg: 'rgba(255,255,255,0.05)',
          },
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
          },
          _active: {
            bg: 'accent.700',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'gray.800',
        borderRadius: 'lg',
        borderWidth: '1px',
        borderColor: 'gray.700',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.300',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);