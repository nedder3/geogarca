import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { ExitExamDialog } from '../ExamModals';

afterEach(cleanup);

describe('ExitExamDialog Component', () => {
  it('renders confirmation question and exit button', async () => {
    const handleExit = jest.fn();
    const { getByText, getByTestId } = await render(
      <ExitExamDialog visible onCancel={jest.fn()} onConfirmExit={handleExit} />
    );

    expect(getByText('¿Estás seguro que quieres salir del modo Examen?')).toBeTruthy();
    fireEvent.press(getByTestId('btn-confirm-exit'));
    expect(handleExit).toHaveBeenCalledTimes(1);
  });
});
