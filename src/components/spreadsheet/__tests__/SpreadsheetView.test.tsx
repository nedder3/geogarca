import React from 'react';
import { render } from '@testing-library/react-native';
import { SpreadsheetView } from '../SpreadsheetView';

describe('SpreadsheetView Component (Hoja de Cálculo)', () => {
  it('renders spreadsheet grid with columns A, B, C, D', async () => {
    const { getByTestId, getByText } = await render(<SpreadsheetView />);

    expect(getByTestId('spreadsheet-view')).toBeTruthy();
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
    expect(getByText('D')).toBeTruthy();
  });

  it('renders numbered row indices 1, 2, 3, 4, 5', async () => {
    const { getAllByText } = await render(<SpreadsheetView />);

    expect(getAllByText('1').length).toBeGreaterThan(0);
    expect(getAllByText('2').length).toBeGreaterThan(0);
    expect(getAllByText('3').length).toBeGreaterThan(0);
    expect(getAllByText('4').length).toBeGreaterThan(0);
    expect(getAllByText('5').length).toBeGreaterThan(0);
  });
});
