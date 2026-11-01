import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { NavigationDrawer } from '../NavigationDrawer';
import { useExamStore } from '@/stores/useExamStore';

afterEach(cleanup);

describe('NavigationDrawer Component - Exam Mode', () => {
  it('renders restricted drawer options when exam mode is active', async () => {
    useExamStore.setState({ isExamActive: true });

    const handleSelect = jest.fn();
    const { getByText, queryByText, getByTestId } = await render(
      <NavigationDrawer visible onClose={jest.fn()} onSelectOption={handleSelect} />
    );

    expect(getByText('Registro de Examen')).toBeTruthy();
    expect(getByText('Abandonar modo Examen')).toBeTruthy();

    // Restricted items must NOT be present
    expect(queryByText('Compartir')).toBeNull();
    expect(queryByText('Propiedades')).toBeNull();
    expect(queryByText('Abrir sesión')).toBeNull();

    fireEvent.press(getByTestId('drawer-opt-exit_exam'));
    expect(handleSelect).toHaveBeenCalledWith('exit_exam');
  });
});
