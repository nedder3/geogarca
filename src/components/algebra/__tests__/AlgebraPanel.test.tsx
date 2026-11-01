import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { AlgebraPanel } from '../AlgebraPanel';
import { useInputStore } from '@/stores/useInputStore';

afterEach(cleanup);

describe('AlgebraPanel Component', () => {
  beforeEach(() => {
    useInputStore.getState().reset();
  });

  it('renders expression items and input bar', async () => {
    const { getByText, getByTestId } = await render(<AlgebraPanel />);

    expect(getByTestId('algebra-panel')).toBeTruthy();
    expect(getByText('f(x) = x²')).toBeTruthy();
    expect(getByText('A = (2, 3)')).toBeTruthy();
    expect(getByText('Entrada...')).toBeTruthy();
  });

  it('activates keyboard on pressing input bar', async () => {
    const handleFocus = jest.fn();
    const { getByTestId } = await render(<AlgebraPanel onFocusInput={handleFocus} />);

    fireEvent.press(getByTestId('algebra-input-bar'));
    expect(useInputStore.getState().isKeyboardVisible).toBe(true);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });
});
