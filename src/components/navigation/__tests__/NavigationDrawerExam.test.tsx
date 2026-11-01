import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { NavigationDrawer } from '../NavigationDrawer';
import { useExamStore } from '@/stores/useExamStore';

afterEach(cleanup);

describe('NavigationDrawer Component - Exam Mode', () => {
  it('renders exam drawer with sub-app switching to prevent getting anchored', async () => {
    useExamStore.setState({ isExamActive: true });

    const handleSelect = jest.fn();
    const { getByText, queryByText, getByTestId } = await render(
      <NavigationDrawer
        visible
        activeAppMode="probability"
        onClose={jest.fn()}
        onSelectOption={handleSelect}
      />
    );

    // Sub-app switching MUST be available in exam mode
    expect(getByText('Probabilidad')).toBeTruthy();
    expect(getByText('Calculadora Gráfica')).toBeTruthy();

    expect(getByText('Registro de Examen')).toBeTruthy();
    expect(getByText('Abandonar modo Examen')).toBeTruthy();

    // Restricted items must NOT be present
    expect(queryByText('Compartir')).toBeNull();
    expect(queryByText('Propiedades')).toBeNull();
    expect(queryByText('Abrir sesión')).toBeNull();

    fireEvent.press(getByTestId('drawer-opt-switch_graphing'));
    expect(handleSelect).toHaveBeenCalledWith('switch_graphing');

    fireEvent.press(getByTestId('drawer-opt-exit_exam'));
    expect(handleSelect).toHaveBeenCalledWith('exit_exam');
  });
});
