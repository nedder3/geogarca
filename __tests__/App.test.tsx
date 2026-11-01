import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import App from '../App';
import { useExamStore } from '@/stores/useExamStore';
import { useInputStore } from '@/stores/useInputStore';

afterEach(cleanup);

describe('GeoGebra Replica App Integration Flow', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
    useInputStore.getState().reset();
  });

  it('renders main application with header, canvas, algebra panel and bottom nav', async () => {
    const { getByTestId, getByText } = await render(<App />);

    expect(getByTestId('normal-header')).toBeTruthy();
    expect(getByTestId('cartesian-grid')).toBeTruthy();
    expect(getByTestId('algebra-panel')).toBeTruthy();
    expect(getByTestId('bottom-nav-bar')).toBeTruthy();
    expect(getByText('Álgebra')).toBeTruthy();
    expect(getByText('Herramientas')).toBeTruthy();
  });

  it('switches between tabs and shows ToolsGallery when clicking Herramientas', async () => {
    const { getByTestId, queryByTestId } = await render(<App />);

    expect(getByTestId('algebra-panel')).toBeTruthy();
    expect(queryByTestId('tools-gallery')).toBeNull();

    await act(async () => {
      fireEvent.press(getByTestId('tab-tools'));
    });

    expect(getByTestId('tools-gallery')).toBeTruthy();
    expect(queryByTestId('algebra-panel')).toBeNull();
  });

  it('executes complete exam lifecycle: open drawer -> start exam -> green header -> exit -> exam ok summary', async () => {
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

    // Header must now be green with Calc. Gráfica and timer
    expect(getByTestId('exam-header')).toBeTruthy();
    expect(getByText('Calc. Gráfica')).toBeTruthy();

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

    // 7. Summary dialog "Examen: OK" is presented
    expect(getByTestId('exam-ok-dialog')).toBeTruthy();
    expect(getByText('Examen: OK')).toBeTruthy();
    expect(getByText('Muestra esta pantalla a tu profesor')).toBeTruthy();

    // 8. Dismiss summary
    await act(async () => {
      fireEvent.press(getByTestId('btn-dismiss-ok'));
    });
    expect(queryByTestId('exam-ok-dialog')).toBeNull();
  });
});
