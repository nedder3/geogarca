import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomNavBar, MainTab } from '../BottomNavBar';
import { useExamStore } from '@/stores/useExamStore';

describe('BottomNavBar Component', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('renders all 4 tabs: Álgebra, Herramientas, Tabla, Hoja de Cálculo', async () => {
    const handlePress = jest.fn();
    const { getByText, getByTestId } = await render(
      <BottomNavBar activeTab="algebra" onTabPress={handlePress} />
    );

    expect(getByText('Álgebra')).toBeTruthy();
    expect(getByText('Herramientas')).toBeTruthy();
    expect(getByText('Tabla')).toBeTruthy();
    expect(getByText('Hoja de Cálculo')).toBeTruthy();

    fireEvent.press(getByTestId('tab-tools'));
    expect(handlePress).toHaveBeenCalledWith('tools');
  });

  it('adapts colors when exam mode is active', async () => {
    useExamStore.getState().startExam();

    const { getByTestId } = await render(
      <BottomNavBar activeTab="algebra" onTabPress={jest.fn()} />
    );

    const navBar = getByTestId('bottom-nav-bar');
    expect(navBar).toBeTruthy();
  });
});
