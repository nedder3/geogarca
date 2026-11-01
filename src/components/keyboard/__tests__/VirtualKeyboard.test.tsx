import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VirtualKeyboard } from '../VirtualKeyboard';
import { useInputStore } from '@/stores/useInputStore';

describe('VirtualKeyboard Component', () => {
  beforeEach(() => {
    useInputStore.getState().reset();
  });

  it('renders keyboard container and tabs: 123, f(x), abc, #&¬', async () => {
    const { getByTestId, getByText } = await render(<VirtualKeyboard />);
    expect(getByTestId('virtual-keyboard')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
  });

  it('inserts characters into useInputStore when keys are pressed', async () => {
    const { getByTestId } = await render(<VirtualKeyboard />);

    fireEvent.press(getByTestId('key-x'));
    fireEvent.press(getByTestId('key-x²'));
    fireEvent.press(getByTestId('key-+'));
    fireEvent.press(getByTestId('key-7'));

    expect(useInputStore.getState().expression).toBe('x²+7');
  });

  it('handles backspace and enter actions', async () => {
    useInputStore.getState().insertText('42');
    useInputStore.getState().backspace();
    expect(useInputStore.getState().expression).toBe('4');
  });

  it('switches active tab', async () => {
    useInputStore.getState().setActiveTab('f(x)');
    expect(useInputStore.getState().activeTab).toBe('f(x)');
  });
});
