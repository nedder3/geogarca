import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GeoGebraTheme } from '@/theme/tokens';

interface Props {
  width?: number;
  height?: number;
}

/**
 * CartesianGrid replicates the millimeter grid and axes of GeoGebra Android.
 * Extracted from reference screenshot WhatsApp Image 2026-10-31 at 10.48.03 PM.jpeg
 */
export const CartesianGrid: React.FC<Props> = ({ width = 360, height = 400 }) => {
  const step = 20; // 20dp between grid lines
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  const verticalLines = [];
  for (let x = 0; x <= width; x += step) {
    verticalLines.push(x);
  }

  const horizontalLines = [];
  for (let y = 0; y <= height; y += step) {
    horizontalLines.push(y);
  }

  // Ticks at intervals of 2 units (every 40dp)
  const xTicks = [-8, -6, -4, -2, 2, 4, 6, 8];
  const yTicks = [8, 6, 4, 2, -2, -4, -6, -8];

  return (
    <View testID="cartesian-grid" style={[styles.container, { width, height }]}>
      {/* Grid Lines */}
      {verticalLines.map((x) => (
        <View
          key={`v-${x}`}
          style={[styles.gridLineV, { left: x, height }]}
          testID="grid-line-v"
        />
      ))}
      {horizontalLines.map((y) => (
        <View
          key={`h-${y}`}
          style={[styles.gridLineH, { top: y, width }]}
          testID="grid-line-h"
        />
      ))}

      {/* Main Axes */}
      <View
        testID="x-axis"
        style={[styles.axisH, { top: centerY, width }]}
      />
      <View
        testID="y-axis"
        style={[styles.axisV, { left: centerX, height }]}
      />

      {/* Axis arrow on positive X */}
      <Text style={[styles.arrowText, { top: centerY - 9, right: 2 }]}>➔</Text>

      {/* Origin label '0' */}
      <Text style={[styles.tickLabel, { left: centerX - 12, top: centerY + 2 }]}>
        0
      </Text>

      {/* Horizontal tick labels */}
      {xTicks.map((val) => {
        const posX = centerX + (val / 2) * 40;
        if (posX < 10 || posX > width - 15) return null;
        return (
          <Text
            key={`xtick-${val}`}
            style={[styles.tickLabel, { left: posX - 6, top: centerY + 3 }]}
          >
            {val}
          </Text>
        );
      })}

      {/* Vertical tick labels */}
      {yTicks.map((val) => {
        const posY = centerY - (val / 2) * 40;
        if (posY < 10 || posY > height - 15) return null;
        return (
          <Text
            key={`ytick-${val}`}
            style={[styles.tickLabel, { left: centerX - 16, top: posY - 7 }]}
          >
            {val}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GeoGebraTheme.colors.canvasBg,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineV: {
    position: 'absolute',
    width: 1,
    backgroundColor: GeoGebraTheme.colors.gridLines,
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    backgroundColor: GeoGebraTheme.colors.gridLines,
  },
  axisH: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: GeoGebraTheme.colors.axesLines,
  },
  axisV: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: GeoGebraTheme.colors.axesLines,
  },
  arrowText: {
    position: 'absolute',
    fontSize: 12,
    color: GeoGebraTheme.colors.axesLines,
  },
  tickLabel: {
    position: 'absolute',
    fontSize: GeoGebraTheme.typography.sizes.axisLabel,
    color: GeoGebraTheme.colors.textPrimary,
  },
});
