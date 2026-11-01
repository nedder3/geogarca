import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SplashScreenView } from '../SplashScreenView';

describe('SplashScreenView Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders splash image and dismisses after duration', async () => {
    const handleFinish = jest.fn();
    const { getByTestId } = await render(
      <SplashScreenView onFinish={handleFinish} durationMs={1000} />
    );

    expect(getByTestId('splash-screen-view')).toBeTruthy();
    expect(getByTestId('splash-image')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1400);
    });

    expect(handleFinish).toHaveBeenCalled();
  });
});
