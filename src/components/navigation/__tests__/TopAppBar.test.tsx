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

  it('renders green exam header with timer, battery, and Suite Calculadora title', async () => {
    useExamStore.getState().setBatteryLevel(85);
    useExamStore.getState().startExam();
    useExamStore.getState().tick(48); // 00:48

    const handleMenu = jest.fn();
    const { getByTestId, getByText, queryByTestId } = await render(
      <TopAppBar onOpenMenu={handleMenu} />
    );

    expect(getByTestId('exam-header')).toBeTruthy();
    expect(queryByTestId('normal-header')).toBeNull();
    expect(getByText('Suite Calculadora')).toBeTruthy();
    expect(getByText('00:48')).toBeTruthy();
    expect(getByText('85%')).toBeTruthy();
    expect(getByTestId('icon-battery-full')).toBeTruthy();
    expect(getByTestId('exam-curve-button')).toBeTruthy();
    expect(getByTestId('exam-table-button')).toBeTruthy();

    fireEvent.press(getByTestId('exam-menu-button'));
    expect(handleMenu).toHaveBeenCalledTimes(1);
  });

  it('renders matching battery icon according to charge level (e.g. 32% with battery-half)', async () => {
    useExamStore.getState().setBatteryLevel(32);
    useExamStore.getState().startExam();

    const { getByText, getByTestId } = await render(
      <TopAppBar onOpenMenu={jest.fn()} />
    );

    expect(getByText('32%')).toBeTruthy();
    expect(getByTestId('icon-battery-half')).toBeTruthy();
  });

  it('renders battery-dead icon for low battery (<30%)', async () => {
    useExamStore.getState().setBatteryLevel(15);
    useExamStore.getState().startExam();

    const { getByText, getByTestId } = await render(
      <TopAppBar onOpenMenu={jest.fn()} />
    );

    expect(getByText('15%')).toBeTruthy();
    expect(getByTestId('icon-battery-dead')).toBeTruthy();
  });
});
