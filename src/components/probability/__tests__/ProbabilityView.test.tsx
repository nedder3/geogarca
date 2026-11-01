import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProbabilityView } from '../ProbabilityView';

describe('ProbabilityView Component', () => {
  it('renders the distribution chart and simulated histogram bars', async () => {
    const { getByTestId, getAllByTestId } = await render(<ProbabilityView />);
    expect(getByTestId('probability-chart')).toBeTruthy();
    const bars = getAllByTestId(/histogram-bar-/);
    expect(bars.length).toBeGreaterThan(0);
  });

  it('renders the interval type selector buttons with simulated values', async () => {
    const { getByTestId } = await render(<ProbabilityView />);
    expect(getByTestId('interval-btn-left')).toBeTruthy();
    expect(getByTestId('interval-btn-between')).toBeTruthy();
    expect(getByTestId('interval-btn-right')).toBeTruthy();
  });

  it('allows switching interval mode when tapping buttons', async () => {
    const { getByTestId } = await render(<ProbabilityView />);
    const betweenBtn = getByTestId('interval-btn-between');
    fireEvent.press(betweenBtn);
    expect(getByTestId('interval-btn-between')).toBeTruthy();
  });

  it('renders Population and Parámetro n inputs with default values 30 and 10', async () => {
    const { getByDisplayValue, getByText } = await render(<ProbabilityView />);
    expect(getByText('Population')).toBeTruthy();
    expect(getByDisplayValue('30')).toBeTruthy();
    expect(getByText('Parámetro n')).toBeTruthy();
    expect(getByDisplayValue('10')).toBeTruthy();
  });

  it('allows editing parameter inputs without crashing', async () => {
    const { getByDisplayValue } = await render(<ProbabilityView />);
    const popInput = getByDisplayValue('30');
    fireEvent.changeText(popInput, '35');
    await waitFor(() => {
      expect(getByDisplayValue('35')).toBeTruthy();
    });
  });
});
