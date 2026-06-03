import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a mobile-friendly theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        success: {
            main: '#4caf50',
        },
        warning: {
            main: '#ff9800',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        // Responsive font sizes
        h1: {
            fontSize: '2.5rem',
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h2: {
            fontSize: '2rem',
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        h3: {
            fontSize: '1.75rem',
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
        },
        h4: {
            fontSize: '1.5rem',
            '@media (max-width:600px)': {
                fontSize: '1.25rem',
            },
        },
        h5: {
            fontSize: '1.25rem',
            '@media (max-width:600px)': {
                fontSize: '1.1rem',
            },
        },
        h6: {
            fontSize: '1rem',
            '@media (max-width:600px)': {
                fontSize: '0.95rem',
            },
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
        },
        button: {
            textTransform: 'none', // Less aggressive button text
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 20px',
                    minHeight: 44, // Mobile-friendly touch target
                    '@media (max-width:600px)': {
                        padding: '12px 20px',
                    },
                },
                sizeSmall: {
                    padding: '6px 16px',
                    minHeight: 36,
                },
                sizeLarge: {
                    padding: '12px 24px',
                    minHeight: 48,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    minWidth: 44, // Mobile-friendly touch target
                    minHeight: 44,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        minHeight: 44, // Mobile-friendly input height
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    '@media (max-width:600px)': {
                        padding: '12px 8px',
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    spacing: 8, // 8px base spacing
    shape: {
        borderRadius: 8,
    },
});

export default theme;
