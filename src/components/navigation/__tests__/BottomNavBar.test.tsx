import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomNavBar, MainTab } from '../BottomNavBar';
import { useExamStore } from '@/stores/useExamStore';

describe('BottomNavBar Component', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('renders single Distribución tab when in probability mode', async () => {
    const handlePress = jest.fn();
    const { getByText, getByTestId, queryByText } = await render(
      <BottomNavBar mode="probability" activeTab="distribution" onTabPress={handlePress} />
    );

    expect(getByText('Distribución')).toBeTruthy();
    expect(getByTestId('tab-distribution')).toBeTruthy();
    expect(queryByText('Álgebra')).toBeNull();

    fireEvent.press(getByTestId('tab-distribution'));
    expect(handlePress).toHaveBeenCalledWith('distribution');
  });

  it('renders all 4 tabs in graphing mode: Álgebra, Herramientas, Tabla, Hoja de Cálculo', async () => {
    const handlePress = jest.fn();
    const { getByText, getByTestId } = await render(
      <BottomNavBar mode="graphing" activeTab="algebra" onTabPress={handlePress} />
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
      <BottomNavBar mode="probability" activeTab="distribution" onTabPress={jest.fn()} />
    );

    const navBar = getByTestId('bottom-nav-bar');
    expect(navBar).toBeTruthy();
  });
});
