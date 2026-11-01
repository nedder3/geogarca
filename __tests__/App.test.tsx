import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import App from '../App';
import { useExamStore } from '@/stores/useExamStore';
import { useInputStore } from '@/stores/useInputStore';

afterEach(cleanup);

describe('GeoGebra Suite Replica App Integration Flow', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
    useInputStore.getState().reset();
  });

  it('renders default Suite Calculadora Probability/Distribution view and bottom nav', async () => {
    const { getByTestId, getByText, queryByText } = await render(<App />);

    expect(getByTestId('normal-header')).toBeTruthy();
    expect(getByTestId('probability-chart')).toBeTruthy();
    expect(getByTestId('bottom-nav-bar')).toBeTruthy();
    expect(getByTestId('tab-distribution')).toBeTruthy();
    expect(getByText('Population')).toBeTruthy();
    expect(getByText('Parámetro n')).toBeTruthy();
    expect(queryByText('Álgebra')).toBeNull();
  });

  it('allows switching to Calculadora Gráfica via drawer and using tabs', async () => {
    const { getByTestId, getByText, queryByTestId } = await render(<App />);

    // Open drawer
    await act(async () => {
      fireEvent.press(getByTestId('menu-button'));
    });

    // Select Calculadora Gráfica
    await act(async () => {
      fireEvent.press(getByTestId('drawer-opt-switch_graphing'));
    });

    expect(getByTestId('cartesian-grid')).toBeTruthy();
    expect(getByTestId('algebra-panel')).toBeTruthy();
    expect(getByText('Álgebra')).toBeTruthy();
    expect(getByText('Herramientas')).toBeTruthy();

    // Switch to Herramientas
    await act(async () => {
      fireEvent.press(getByTestId('tab-tools'));
    });
    expect(getByTestId('tools-gallery')).toBeTruthy();
    expect(queryByTestId('algebra-panel')).toBeNull();
  });

  it('executes complete exam lifecycle in Suite Calculadora: open drawer -> start exam -> green header -> exit -> exam ok summary', async () => {
    const { getByTestId, getByText, queryByTestId } = await render(<App />);

    // 1. Open drawer
    await act(async () => {
      fireEvent.press(getByTestId('menu-button'));
    });
    expect(getByTestId('navigation-drawer')).toBeTruthy();

    // 2. Click "Examen" in drawer
    await act(async () => {
      fireEvent.press(getByTestId('drawer-opt-exam'));
    });
    expect(getByTestId('start-exam-dialog')).toBeTruthy();

    // 3. Confirm start exam
    await act(async () => {
      fireEvent.press(getByTestId('btn-confirm-start'));
    });
    expect(useExamStore.getState().isExamActive).toBe(true);

    // Header must now be green with Suite Calculadora and timer
    expect(getByTestId('exam-header')).toBeTruthy();
    expect(getByText('Suite Calculadora')).toBeTruthy();

    // 4. Open drawer during exam mode
    await act(async () => {
      fireEvent.press(getByTestId('exam-menu-button'));
    });
    expect(getByTestId('navigation-drawer')).toBeTruthy();

    // 5. Click "Abandonar modo Examen"
    await act(async () => {
      fireEvent.press(getByTestId('drawer-opt-exit_exam'));
    });
    expect(getByTestId('exit-exam-dialog')).toBeTruthy();

    // 6. Confirm Exit
    await act(async () => {
      fireEvent.press(getByTestId('btn-confirm-exit'));
    });
    expect(useExamStore.getState().isExamActive).toBe(false);

    // 7. Summary dialog "Examen: OK" is presented with "Suite Calculadora GeoGebra"
    expect(getByTestId('exam-ok-dialog')).toBeTruthy();
    expect(getByText('Examen: OK')).toBeTruthy();
    expect(getByText('Suite Calculadora GeoGebra')).toBeTruthy();
    expect(getByText('Muestra esta pantalla a tu profesor')).toBeTruthy();

    // 8. Dismiss summary
    await act(async () => {
      fireEvent.press(getByTestId('btn-dismiss-ok'));
    });
    expect(queryByTestId('exam-ok-dialog')).toBeNull();
  });

  it('allows switching distributions and toggling probability table during active Exam mode', async () => {
    useExamStore.getState().startExam();

    const { getByTestId, getByText, queryByTestId } = await render(<App />);

    expect(getByTestId('exam-header')).toBeTruthy();
    expect(getByText('Suite Calculadora')).toBeTruthy();

    // 1. Toggle distribution picker during exam
    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });
    expect(getByTestId('distribution-picker-modal')).toBeTruthy();

    // 2. Select Poisson
    await act(async () => {
      fireEvent.press(getByTestId('dist-option-poisson'));
    });
    expect(getByText('Poisson')).toBeTruthy();
    expect(getByText('Media λ')).toBeTruthy();

    // 3. Toggle table via top bar exam button
    expect(queryByTestId('probability-table')).toBeNull();
    await act(async () => {
      fireEvent.press(getByTestId('exam-table-button'));
    });
    expect(getByTestId('probability-table')).toBeTruthy();
    expect(getByText('P(X = k)')).toBeTruthy();

    // 4. Switch to Binomial
    await act(async () => {
      fireEvent.press(getByTestId('distribution-selector-btn'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('dist-option-binomial'));
    });
    expect(getByText('Binomial')).toBeTruthy();
    expect(getByText('Ensayos n')).toBeTruthy();
  });
});
