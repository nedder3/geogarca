import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { ExamOkDialog } from '../ExamModals';
import { useExamStore } from '@/stores/useExamStore';

afterEach(cleanup);

describe('ExamOkDialog Component', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('renders green header with Examen: OK and formatted statistics', async () => {
    useExamStore.getState().startExam(new Date('2026-10-31T22:44:20'));
    useExamStore.getState().tick(63); // 01:03
    useExamStore.getState().finishExam(new Date('2026-10-31T22:45:24'));

    const handleDismiss = jest.fn();
    const { getByText, getByTestId } = await render(
      <ExamOkDialog visible onDismiss={handleDismiss} />
    );

    expect(getByText('Examen: OK')).toBeTruthy();
    expect(getByText('Calculadora Gráfica GeoGebra')).toBeTruthy();
    expect(getByText('Muestra esta pantalla a tu profesor')).toBeTruthy();
    expect(getByText('01:03')).toBeTruthy();

    fireEvent.press(getByTestId('btn-dismiss-ok'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
