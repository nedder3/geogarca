import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToolsGallery } from '../ToolsGallery';

describe('ToolsGallery Component', () => {
  it('renders tool categories: Herramientas básicas and Edición', async () => {
    const { getByText, getByTestId } = await render(<ToolsGallery />);

    expect(getByTestId('tools-gallery')).toBeTruthy();
    expect(getByText('Herramientas básicas')).toBeTruthy();
    expect(getByText('Edición')).toBeTruthy();
  });

  it('renders basic tools: Mueve, Punto, Deslizador, Intersección', async () => {
    const { getByText } = await render(<ToolsGallery />);

    expect(getByText('Mueve')).toBeTruthy();
    expect(getByText('Punto')).toBeTruthy();
    expect(getByText('Deslizador')).toBeTruthy();
    expect(getByText('Intersección')).toBeTruthy();
  });

  it('calls onSelectTool when a tool is pressed', async () => {
    const handleSelect = jest.fn();
    const { getByTestId } = await render(<ToolsGallery onSelectTool={handleSelect} />);

    fireEvent.press(getByTestId('tool-point'));
    expect(handleSelect).toHaveBeenCalledWith('point');
  });
});
