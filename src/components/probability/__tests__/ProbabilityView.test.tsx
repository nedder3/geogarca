import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ProbabilityView } from '../ProbabilityView';

describe('ProbabilityView Component - Multi-Distribution Mocks', () => {
  it('renders distribution selector button and default distribution', async () => {
    const { getByTestId, getByText } = await render(<ProbabilityView />);
    expect(getByTestId('probability-chart')).toBeTruthy();
    expect(getByTestId('distribution-selector-btn')).toBeTruthy();
    expect(getByText('Hipergeométrica')).toBeTruthy();
  });

  it('opens distribution picker modal when clicking selector', async () => {
    const { getByTestId, getByText } = await render(<ProbabilityView />);

    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });

    expect(getByTestId('distribution-picker-modal')).toBeTruthy();
    expect(getByText('Binomial')).toBeTruthy();
    expect(getByText('Poisson')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();
    expect(getByText('Geométrica')).toBeTruthy();
  });

  it('switches to Poisson distribution with mocked lambda=4 parameter and formula', async () => {
    const { getByTestId, getByText, queryByTestId } = await render(<ProbabilityView />);

    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });

    await act(async () => {
      fireEvent.press(getByTestId('dist-option-poisson'));
    });

    // Modal closed
    expect(queryByTestId('distribution-picker-modal')).toBeNull();

    // Verify Poisson parameters and result
    expect(getByText('Poisson')).toBeTruthy();
    expect(getByText('Media λ')).toBeTruthy();
    expect(getByText(/P\(X ≤ 4\) = 0\.6288/)).toBeTruthy();
  });

  it('switches to Binomial distribution with mocked n=20, p=0.5 parameters and formula', async () => {
    const { getByTestId, getByText } = await render(<ProbabilityView />);

    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });

    await act(async () => {
      fireEvent.press(getByTestId('dist-option-binomial'));
    });

    expect(getByText('Binomial')).toBeTruthy();
    expect(getByText('Ensayos n')).toBeTruthy();
    expect(getByText('Probabilidad p')).toBeTruthy();
    expect(getByText(/P\(X ≤ 10\) = 0\.5881/)).toBeTruthy();
  });

  it('switches to Normal distribution with continuous curve and mu=0, sigma=1', async () => {
    const { getByTestId, getByText } = await render(<ProbabilityView />);

    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });

    await act(async () => {
      fireEvent.press(getByTestId('dist-option-normal'));
    });

    expect(getByText('Normal')).toBeTruthy();
    expect(getByTestId('normal-continuous-curve')).toBeTruthy();
    expect(getByText('Media μ')).toBeTruthy();
    expect(getByText('Desv. Est. σ')).toBeTruthy();
  });

  it('toggles probability values table when showTable prop is true', async () => {
    const { getByTestId, getByText } = await render(
      <ProbabilityView showTable={true} />
    );

    expect(getByTestId('probability-table')).toBeTruthy();
    expect(getByText('P(X = k)')).toBeTruthy();
    expect(getByText('k')).toBeTruthy();
  });

  it('updates formula and highlighted bars when switching interval modes', async () => {
    const { getByTestId, getByText } = await render(<ProbabilityView />);

    // Tap Between
    await act(async () => {
      fireEvent.press(getByTestId('interval-btn-between'));
    });
    expect(getByText(/P\(2 ≤ X ≤ 4\)/)).toBeTruthy();

    // Tap Right
    await act(async () => {
      fireEvent.press(getByTestId('interval-btn-right'));
    });
    expect(getByText(/P\(X ≥ 3\)/)).toBeTruthy();
  });
});
