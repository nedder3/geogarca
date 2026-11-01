import React from 'react';
import { render } from '@testing-library/react-native';
import { CartesianGrid } from '../CartesianGrid';

describe('CartesianGrid Component', () => {
  it('renders cartesian grid container with default dimensions', async () => {
    const { getByTestId } = await render(<CartesianGrid width={360} height={400} />);
    const grid = getByTestId('cartesian-grid');
    expect(grid).toBeTruthy();
  });

  it('renders main X and Y axes', async () => {
    const { getByTestId } = await render(<CartesianGrid width={360} height={400} />);
    expect(getByTestId('x-axis')).toBeTruthy();
    expect(getByTestId('y-axis')).toBeTruthy();
  });

  it('renders grid lines', async () => {
    const { getAllByTestId } = await render(<CartesianGrid width={100} height={100} />);
    const vLines = getAllByTestId('grid-line-v');
    const hLines = getAllByTestId('grid-line-h');
    expect(vLines.length).toBeGreaterThan(0);
    expect(hLines.length).toBeGreaterThan(0);
  });
});

