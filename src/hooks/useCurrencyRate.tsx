import { useState } from 'react';

const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

const INITIAL_VALUE = 1.1;
const MIN_VALUE = 0.6;
const MAX_VALUE = 1.6;

export const useCurrencyRate = (useApi = false) => {
    const [rate, setRate] = useState<number>(INITIAL_VALUE);

    const updateRate = () => {
        if (useApi) {
            fetch(BASE_URL)
                .then((response) => response.json())
                .then((data) => {
                    setRate(data.rates.USD);
                })
                .catch((error) =>
                    console.error(
                        'Erreur lors de la récupération du taux:',
                        error
                    )
                );
        } else {
            const randomAdjustment = Math.random() * 0.1 - 0.05;
            let newRate = parseFloat((rate + randomAdjustment).toFixed(4));
            if (newRate < MIN_VALUE) {
                newRate = MIN_VALUE;
            }
            if (newRate > MAX_VALUE) {
                newRate = MAX_VALUE;
            }
            setRate(newRate);
        }
    };

    return { rate, updateRate };
};
