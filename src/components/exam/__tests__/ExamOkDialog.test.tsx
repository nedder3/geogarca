import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { ExamOkDialog } from '../ExamModals';
import { useExamStore } from '@/stores/useExamStore';

afterEach(cleanup);

describe('ExamOkDialog Component', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('renders green header with Examen: OK and formatted statistics congruent with wall-clock timestamps', async () => {
    useExamStore.getState().startExam(new Date('2026-10-31T22:44:20'));
    useExamStore.getState().finishExam(new Date('2026-10-31T22:45:24')); // +64 seconds

    const handleDismiss = jest.fn();
    const { getByText, getByTestId } = await render(
      <ExamOkDialog visible onDismiss={handleDismiss} />
    );

    expect(getByText('Examen: OK')).toBeTruthy();
    expect(getByText('Suite Calculadora GeoGebra')).toBeTruthy();
    expect(getByText('Muestra esta pantalla a tu profesor')).toBeTruthy();
    expect(getByText('01:04')).toBeTruthy();

    fireEvent.press(getByTestId('btn-dismiss-ok'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('guarantees duration is congruent with endDate - startDate even after being backgrounded for 41 minutes', async () => {
    // Exact scenario from user's professor exam screenshot
    const start = new Date('2026-10-26T20:08:26.000Z');
    const end = new Date('2026-10-26T20:49:30.000Z');

    useExamStore.getState().startExam(start);
    // Simulating app being minimized with no tick() calls
    useExamStore.getState().finishExam(end);

    const { getByText } = await render(
      <ExamOkDialog visible onDismiss={jest.fn()} />
    );

    // Duration MUST be 41:04 (41 minutes 4 seconds)
    expect(getByText('41:04')).toBeTruthy();
  });
});
