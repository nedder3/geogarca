import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsDialog } from '../SettingsDialog';

describe('SettingsDialog Component', () => {
  it('renders settings items and closes on button press', async () => {
    const handleClose = jest.fn();
    const { getByTestId, getByText } = await render(
      <SettingsDialog visible onClose={handleClose} />
    );

    expect(getByTestId('settings-dialog')).toBeTruthy();
    expect(getByText('Propiedades')).toBeTruthy();
    expect(getByText('Redondeo')).toBeTruthy();
    expect(getByText('2 cifras decimales')).toBeTruthy();

    fireEvent.press(getByTestId('settings-ok-btn'));
    expect(handleClose).toHaveBeenCalled();
  });
});
