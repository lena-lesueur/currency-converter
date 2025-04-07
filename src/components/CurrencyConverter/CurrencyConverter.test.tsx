import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';
import { useCurrencyRate } from '../../hooks/useCurrencyRate';

jest.mock('../../hooks/useCurrencyRate', () => ({
    useCurrencyRate: jest.fn(),
}));

describe('CurrencyConverter', () => {
    let mockUpdateRate: jest.Mock;

    beforeEach(() => {
        mockUpdateRate = jest.fn();
        // Définir la valeur retournée par le hook mocké
        (useCurrencyRate as jest.Mock).mockReturnValue({ rate: 1.11, updateRate: mockUpdateRate });
        localStorage.clear(); // Nettoyer le localStorage avant chaque test
    });

    it('should render the initial component', () => {
        render(<CurrencyConverter />);

        // Vérifier si les éléments sont présents
        expect(screen.getByText(/Convertisseur Euro - Dollars/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Taux de change fixe \(optionnel\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Taux d'usage/i)).toBeInTheDocument();
    });

    it('should switch between EUR to USD and USD to EUR', () => {
        render(<CurrencyConverter />);

        // Vérifier l'état initial (EUR → USD)
        expect(screen.getByText('EUR → USD')).toBeInTheDocument();

        // Simuler le changement avec le switch
        fireEvent.click(screen.getByLabelText(/USD → EUR/i));

        // Vérifier si le texte a changé (USD → EUR)
        expect(screen.getByText('USD → EUR')).toBeInTheDocument();
    });

    it('should convert EUR to USD and display the converted value', async () => {
        render(<CurrencyConverter />);

        // Saisir un montant en EUR
        fireEvent.change(screen.getByLabelText(/Montant en EUR/i), { target: { value: '10' } });

        // Vérifier si le montant en USD est bien calculé
        await waitFor(() => {
            expect(screen.getByText(/Valeur en USD : 11.10/)).toBeInTheDocument();
        });
    });

    it('should add conversion to history', async () => {
        render(<CurrencyConverter />);

        // Saisir un montant en EUR
        fireEvent.change(screen.getByLabelText(/Montant en EUR/i), { target: { value: '10' } });

        // Ajouter à l'historique
        fireEvent.click(screen.getByText(/Ajouter à l'historique/i));

        // Vérifier l'historique
        await waitFor(() => {
            expect(screen.getByText(/Historique des conversions EUR → USD/)).toBeInTheDocument();
        });
    });

    it('should show an error if the fixed rate is too far from the current rate', async () => {
        render(<CurrencyConverter />);

        // Saisir un taux fixe très éloigné
        fireEvent.change(screen.getByLabelText(/Taux de change fixe \(optionnel\)/i), { target: { value: '5' } });

        // Vérifier si le message d'erreur s'affiche
        await waitFor(() => {
            expect(screen.getByText(/Le taux fixe est trop éloigné du taux actuel/)).toBeInTheDocument();
        });
    });

    it('should update the conversion history in localStorage', async () => {
        render(<CurrencyConverter />);

        // Saisir un montant en EUR et ajouter à l'historique
        fireEvent.change(screen.getByLabelText(/Montant en EUR/i), { target: { value: '20' } });
        fireEvent.click(screen.getByText(/Ajouter à l'historique/i));

        // Vérifier si les données sont dans le localStorage
        await waitFor(() => {
            const history = JSON.parse(localStorage.getItem('conversionHistoryEURtoUSD') || '[]');
            expect(history.length).toBe(1);
            expect(history[0].amountInitial).toBe(20);
            expect(history[0].amountConverted).toBe(22.20); // En fonction du taux de conversion actuel
        });
    });
});