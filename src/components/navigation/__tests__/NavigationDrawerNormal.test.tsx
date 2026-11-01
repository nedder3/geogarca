import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { NavigationDrawer } from '../NavigationDrawer';

afterEach(cleanup);

describe('NavigationDrawer Component - Normal Mode', () => {
  it('renders normal drawer options including Examen and Propiedades', async () => {
    const handleSelect = jest.fn();
    const handleClose = jest.fn();

    const { getByText, getByTestId } = await render(
      <NavigationDrawer visible onClose={handleClose} onSelectOption={handleSelect} />
    );

    expect(getByText('Calculadora Gráfica GeoGebra')).toBeTruthy();
    expect(getByText('Borrar todo')).toBeTruthy();
    expect(getByText('Abrir')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
    expect(getByText('Compartir')).toBeTruthy();
    expect(getByText('Examen')).toBeTruthy();
    expect(getByText('Propiedades')).toBeTruthy();
    expect(getByText('Abrir sesión')).toBeTruthy();

    fireEvent.press(getByTestId('drawer-opt-exam'));
    expect(handleSelect).toHaveBeenCalledWith('exam');

    fireEvent.press(getByTestId('drawer-backdrop'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
