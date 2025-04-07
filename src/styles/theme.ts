import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f4f4f4',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h1: {
            fontWeight: 600,
        },
        h2: {
            fontWeight: 500,
        },
        body1: {
            fontSize: '16px',
        },
    },
    spacing: 8,
});

export default theme;
