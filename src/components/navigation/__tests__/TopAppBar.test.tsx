import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TopAppBar } from '../TopAppBar';
import { useExamStore } from '@/stores/useExamStore';

describe('TopAppBar Component', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('renders normal white header when exam mode is inactive', async () => {
    const handleMenu = jest.fn();
    const { getByTestId, queryByTestId } = await render(<TopAppBar onOpenMenu={handleMenu} />);

    expect(getByTestId('normal-header')).toBeTruthy();
    expect(queryByTestId('exam-header')).toBeNull();

    fireEvent.press(getByTestId('menu-button'));
    expect(handleMenu).toHaveBeenCalledTimes(1);
  });

  it('renders green exam header with timer and battery when exam mode is active', async () => {
    useExamStore.getState().startExam();
    useExamStore.getState().tick(48); // 00:48

    const handleMenu = jest.fn();
    const { getByTestId, getByText, queryByTestId } = await render(
      <TopAppBar onOpenMenu={handleMenu} />
    );

    expect(getByTestId('exam-header')).toBeTruthy();
    expect(queryByTestId('normal-header')).toBeNull();
    expect(getByText('Calc. Gráfica')).toBeTruthy();
    expect(getByText('00:48')).toBeTruthy();
    expect(getByText('85%')).toBeTruthy();

    fireEvent.press(getByTestId('exam-menu-button'));
    expect(handleMenu).toHaveBeenCalledTimes(1);
  });
});
