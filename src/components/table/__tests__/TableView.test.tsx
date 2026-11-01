import React from 'react';
import { render } from '@testing-library/react-native';
import { TableView } from '../TableView';

describe('TableView Component (Calculadora Gráfica Tabla de Valores)', () => {
  it('renders table header with column x and f(x) = x²', async () => {
    const { getByTestId, getByText } = await render(<TableView />);

    expect(getByTestId('table-view')).toBeTruthy();
    expect(getByText('x')).toBeTruthy();
    expect(getByText('f(x) = x²')).toBeTruthy();
  });

  it('renders simulated table rows with calculated values', async () => {
    const { getByText, getAllByText } = await render(<TableView />);

    // Check row -2 => 4 and 2 => 4
    expect(getByText('-2')).toBeTruthy();
    expect(getAllByText('4').length).toBe(2);

    // Check row 0 => 0
    expect(getAllByText('0').length).toBe(2);
  });

  it('renders settings bar with table range (Inicio, Fin, Paso)', async () => {
    const { getByText } = await render(<TableView />);
    expect(getByText('Rango de valores: -2 a 2 (paso 1)')).toBeTruthy();
  });
});
