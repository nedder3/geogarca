import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { StartExamDialog } from '../ExamModals';

afterEach(cleanup);

describe('StartExamDialog Component', () => {
  it('renders title, message and buttons', async () => {
    const handleCancel = jest.fn();
    const handleConfirm = jest.fn();

    const { getByText, getByTestId } = await render(
      <StartExamDialog visible onCancel={handleCancel} onConfirm={handleConfirm} />
    );

    expect(getByText('Iniciar Examen')).toBeTruthy();
    expect(getByText('Esta aplicación está fijada')).toBeTruthy();

    fireEvent.press(getByTestId('btn-confirm-start'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('btn-cancel-start'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
