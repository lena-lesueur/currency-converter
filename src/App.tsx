import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CurrencyConverter from './components/CurrencyConverter/CurrencyConverter';

const App: React.FC = () => {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4">Convertisseur de devises</Typography>
                <CurrencyConverter />
            </Box>
        </Container>
    );
};

export default App;
