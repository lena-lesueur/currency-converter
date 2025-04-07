import React, { useState, useEffect, useMemo } from 'react';
import {
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    Switch,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { useCurrencyRate } from '../../hooks/useCurrencyRate';

const INITIAL_VALUE = 1.11;
const MAX_FIXED_RATE_DIFF_PERCENT = 2;

const HISTORY_STORAGE_KEY_EUR_TO_USD = 'conversionHistoryEURtoUSD';
const HISTORY_STORAGE_KEY_USD_TO_EUR = 'conversionHistoryUSDtoEUR';

interface ConversionHistoryItem {
    timestamp: string;
    rate: number;
    amountInitial: number;
    amountConverted: number;
}

const CurrencyConverter: React.FC = () => {
    const [amountEur, setAmountEur] = useState<number>(INITIAL_VALUE);
    const [amountUsd, setAmountUsd] = useState<number>(1 / INITIAL_VALUE);
    const [isEuroToDollar, setIsEuroToDollar] = useState(true);
    const { rate, updateRate } = useCurrencyRate();
    const [fixedRate, setFixedRate] = useState<number | null>(null);
    const [isFixedRateError, setIsFixedRateError] = useState<boolean>(false);

    const [historyEurUsd, setHistoryEurUsd] = useState<ConversionHistoryItem[]>(
        []
    );
    const [historyUsdEur, setHistoryUsdEur] = useState<ConversionHistoryItem[]>(
        []
    );

    useEffect(() => {
        const interval = setInterval(() => {
            updateRate();
        }, 3000);

        return () => clearInterval(interval);
    }, [updateRate]);

    useEffect(() => {
        const storedHistoryEurToUsd = localStorage.getItem(
            HISTORY_STORAGE_KEY_EUR_TO_USD
        );
        const storedHistoryUsdToEur = localStorage.getItem(
            HISTORY_STORAGE_KEY_USD_TO_EUR
        );

        if (storedHistoryEurToUsd) {
            setHistoryEurUsd(JSON.parse(storedHistoryEurToUsd));
        }

        if (storedHistoryUsdToEur) {
            setHistoryUsdEur(JSON.parse(storedHistoryUsdToEur));
        }
    }, []);

    const handleSwitchChange = () => {
        setIsEuroToDollar(!isEuroToDollar);
        setFixedRate(null);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            isEuroToDollar ? setAmountEur(0) : setAmountUsd(0);
        } else {
            const parsedValue = parseFloat(event.target.value);
            if (!isNaN(parsedValue)) {
                const formattedValue = parsedValue.toFixed(2);
                isEuroToDollar
                    ? setAmountEur(parseFloat(formattedValue))
                    : setAmountUsd(parseFloat(formattedValue));
            }
        }
    };

    const handleFixedRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value === '') {
            setFixedRate(null);
        } else {
            const parsedValue = parseFloat(event.target.value);
            if (!isNaN(parsedValue)) {
                const formattedValue = parsedValue.toFixed(4);
                setFixedRate(parseFloat(formattedValue));
            }
        }
    };

    useEffect(() => {
        if (fixedRate) {
            const currRate = isEuroToDollar ? rate : 1 / rate;
            const rateDifference =
                (Math.abs(fixedRate - currRate) / currRate) * 100;
            setIsFixedRateError(rateDifference > MAX_FIXED_RATE_DIFF_PERCENT); // Seuil
        } else {
            setIsFixedRateError(false);
        }
    }, [fixedRate, isEuroToDollar, rate]);

    const currRate = useMemo(() => {
        let rateValue = 0;

        if (isFixedRateError || !fixedRate) {
            rateValue = isEuroToDollar ? rate : 1 / rate;
        } else {
            rateValue = fixedRate;
        }

        // Arrondir à 4 chiffres après la virgule
        return parseFloat(rateValue.toFixed(4));
    }, [fixedRate, isEuroToDollar, isFixedRateError, rate]);

    useEffect(() => {
        if (isEuroToDollar) {
            setAmountUsd(Number((amountEur * currRate).toFixed(2)));
        } else {
            setAmountEur(Number((amountUsd * currRate).toFixed(2)));
        }
    }, [amountEur, amountUsd, currRate, isEuroToDollar]);

    const addHistoryItem = (
        conversionType: 'EURtoUSD' | 'USDtoEUR',
        rate: number,
        amountInitial: number,
        amountConverted: number
    ) => {
        const newHistoryItem = {
            timestamp: new Date().toLocaleString(),
            rate,
            amountInitial,
            amountConverted,
        };

        if (conversionType === 'EURtoUSD') {
            const updatedHistory = [newHistoryItem, ...historyEurUsd];
            if (updatedHistory.length > 5) updatedHistory.pop();
            setHistoryEurUsd(updatedHistory);
            localStorage.setItem(
                HISTORY_STORAGE_KEY_EUR_TO_USD,
                JSON.stringify(updatedHistory)
            );
        } else if (conversionType === 'USDtoEUR') {
            const updatedHistory = [newHistoryItem, ...historyUsdEur];
            if (updatedHistory.length > 5) updatedHistory.pop();
            setHistoryUsdEur(updatedHistory);
            localStorage.setItem(
                HISTORY_STORAGE_KEY_USD_TO_EUR,
                JSON.stringify(updatedHistory)
            );
        }
    };

    const addToHistory = () => {
        if (isEuroToDollar) {
            addHistoryItem('EURtoUSD', currRate, amountEur, amountUsd);
        } else {
            addHistoryItem('USDtoEUR', currRate, amountUsd, amountEur);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Paper
                elevation={3}
                sx={{ p: 4, maxWidth: 800, mx: 'auto', mb: 4 }}
            >
                <Typography variant="h5" gutterBottom>
                    Convertisseur Euro - Dollars
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    mt={2}
                >
                    <Typography variant="body1">EUR → USD</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!isEuroToDollar}
                                onChange={handleSwitchChange}
                                color="primary"
                            />
                        }
                        label="USD → EUR"
                    />
                </Box>
                <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    gutterBottom
                >
                    Taux de change actuel :{' '}
                    {isEuroToDollar
                        ? `1 EUR = ${rate.toFixed(4)} USD`
                        : `1 USD = ${(1 / rate).toFixed(4)} EUR`}
                </Typography>
                <TextField
                    type="number"
                    label="Taux de change fixe (optionnel)"
                    value={fixedRate ?? ''}
                    onChange={handleFixedRateChange}
                    fullWidth
                    error={isFixedRateError}
                    helperText={
                        isFixedRateError
                            ? 'Le taux fixe est trop éloigné du taux actuel'
                            : ''
                    }
                    sx={{ mb: 8 }}
                />

                <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    gutterBottom
                >
                    Taux d'usage :
                    {isEuroToDollar
                        ? `1 EUR = ${currRate.toFixed(4)} USD`
                        : `1 USD = ${currRate.toFixed(4)} EUR`}
                </Typography>
                <TextField
                    type="number"
                    placeholder="0.00"
                    label={isEuroToDollar ? 'Montant en EUR' : 'Montant en USD'}
                    value={isEuroToDollar ? amountEur : amountUsd}
                    onChange={handleAmountChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Typography variant="h6">
                    {isEuroToDollar
                        ? `Valeur en USD : ${amountUsd.toFixed(2)}`
                        : `Valeur en EUR : ${amountEur.toFixed(2)}`}
                </Typography>
                <Button
                    variant="contained"
                    onClick={addToHistory}
                    sx={{ mt: 2 }}
                >
                    Ajouter à l'historique
                </Button>
            </Paper>
            <Paper
                elevation={3}
                sx={{ p: 4, maxWidth: 800, mx: 'auto', mb: 4 }}
            >
                <h3>Historique des conversions EUR → USD</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Taux</TableCell>
                            <TableCell>Montant (EUR)</TableCell>
                            <TableCell>Conversion (USD)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyEurUsd.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item.rate}</TableCell>
                                <TableCell>{item.amountInitial}</TableCell>
                                <TableCell>{item.amountConverted}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Paper
                elevation={3}
                sx={{ p: 4, maxWidth: 800, mx: 'auto', mb: 4 }}
            >
                <h3>Historique des conversions USD → EUR</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Taux</TableCell>
                            <TableCell>Montant (USD)</TableCell>
                            <TableCell>Conversion (EUR)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyUsdEur.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item.rate}</TableCell>
                                <TableCell>{item.amountInitial}</TableCell>
                                <TableCell>{item.amountConverted}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default CurrencyConverter;
