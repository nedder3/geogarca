import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';

export type IntervalMode = 'left' | 'between' | 'right';

interface BarData {
  id: number;
  height: number;
  filled: boolean;
  value: string;
}

export const ProbabilityView: React.FC = () => {
  const [intervalMode, setIntervalMode] = useState<IntervalMode>('left');
  const [population, setPopulation] = useState('30');
  const [paramN, setParamN] = useState('10');
  const [paramP, setParamP] = useState('0.5');

  // Simulated discrete distribution bars matching GeoGebra Suite Probabilidad
  // In the reference screenshot: a filled purple bar followed by hollow bars with purple borders
  const bars: BarData[] = [
    { id: 0, height: 40, filled: intervalMode === 'left', value: '8' },
    { id: 1, height: 75, filled: intervalMode === 'left', value: '9' },
    { id: 2, height: 130, filled: intervalMode === 'left', value: '10' },
    { id: 3, height: 160, filled: intervalMode === 'between', value: '11' },
    { id: 4, height: 110, filled: intervalMode === 'right', value: '12' },
    { id: 5, height: 60, filled: intervalMode === 'right', value: '13' },
    { id: 6, height: 25, filled: intervalMode === 'right', value: '14' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Upper Area: Distribution Bar Chart / Histogram */}
      <View testID="probability-chart" style={styles.chartArea}>
        <View style={styles.barsRow}>
          {bars.map((bar) => (
            <View key={bar.id} style={styles.barColumn}>
              <View
                testID={`histogram-bar-${bar.id}`}
                style={[
                  styles.bar,
                  { height: bar.height },
                  bar.filled ? styles.barFilled : styles.barHollow,
                ]}
              />
              <Text style={styles.barLabel}>{bar.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.baseline} />
      </View>

      {/* Middle Area: Interval Selector Buttons */}
      <View style={styles.intervalButtonsRow}>
        <TouchableOpacity
          testID="interval-btn-left"
          onPress={() => setIntervalMode('left')}
          style={[
            styles.intervalBtn,
            intervalMode === 'left' && styles.intervalBtnActive,
          ]}
          accessibilityLabel="Cola izquierda P(X <= x)"
        >
          <Text
            style={[
              styles.intervalText,
              intervalMode === 'left' && styles.intervalTextActive,
            ]}
          >
            ] ≤ ]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="interval-btn-between"
          onPress={() => setIntervalMode('between')}
          style={[
            styles.intervalBtn,
            intervalMode === 'between' && styles.intervalBtnActive,
          ]}
          accessibilityLabel="Intervalo P(x1 <= X <= x2)"
        >
          <Text
            style={[
              styles.intervalText,
              intervalMode === 'between' && styles.intervalTextActive,
            ]}
          >
            [ ≤ X ≤ ]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="interval-btn-right"
          onPress={() => setIntervalMode('right')}
          style={[
            styles.intervalBtn,
            intervalMode === 'right' && styles.intervalBtnActive,
          ]}
          accessibilityLabel="Cola derecha P(X >= x)"
        >
          <Text
            style={[
              styles.intervalText,
              intervalMode === 'right' && styles.intervalTextActive,
            ]}
          >
            [ ≥ [
          </Text>
        </TouchableOpacity>
      </View>

      {/* Probability Result Line */}
      <View style={styles.resultBanner}>
        <Text style={styles.resultText}>
          {intervalMode === 'left' && `P(X ≤ ${paramN}) = 0.542`}
          {intervalMode === 'between' && `P(9 ≤ X ≤ ${paramN}) = 0.381`}
          {intervalMode === 'right' && `P(X ≥ ${paramN}) = 0.458`}
        </Text>
      </View>

      {/* Parameter Cards: Outlined Material Input Fields */}
      <View style={styles.inputsSection}>
        {/* Population Input */}
        <View style={styles.outlinedInputContainer}>
          <Text style={styles.floatingLabel}>Population</Text>
          <TextInput
            testID="input-population"
            value={population}
            onChangeText={setPopulation}
            keyboardType="numeric"
            style={styles.textInput}
          />
        </View>

        {/* Parámetro n Input */}
        <View style={styles.outlinedInputContainer}>
          <Text style={styles.floatingLabel}>Parámetro n</Text>
          <TextInput
            testID="input-param-n"
            value={paramN}
            onChangeText={setParamN}
            keyboardType="numeric"
            style={styles.textInput}
          />
        </View>

        {/* Parámetro p Input */}
        <View style={styles.outlinedInputContainer}>
          <Text style={styles.floatingLabel}>Probabilidad p</Text>
          <TextInput
            testID="input-param-p"
            value={paramP}
            onChangeText={setParamP}
            keyboardType="decimal-pad"
            style={styles.textInput}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  chartArea: {
    height: 220,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 180,
  },
  barColumn: {
    alignItems: 'center',
    width: 38,
  },
  bar: {
    width: 36,
    borderWidth: 2,
    borderColor: '#3F2B7A',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barFilled: {
    backgroundColor: '#534686',
  },
  barHollow: {
    backgroundColor: '#FFFFFF',
  },
  barLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  baseline: {
    height: 1.5,
    backgroundColor: '#757575',
    width: '90%',
    alignSelf: 'center',
  },
  intervalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 14,
    paddingHorizontal: 16,
  },
  intervalBtn: {
    minWidth: 54,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
    backgroundColor: '#F0F0F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4D4DC',
  },
  intervalBtnActive: {
    backgroundColor: '#534686',
    borderColor: '#534686',
  },
  intervalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  intervalTextActive: {
    color: '#FFFFFF',
  },
  resultBanner: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3F2B7A',
  },
  inputsSection: {
    paddingHorizontal: 20,
    gap: 14,
  },
  outlinedInputContainer: {
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  floatingLabel: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  textInput: {
    fontSize: 16,
    color: '#1F1F1F',
    fontWeight: '500',
    padding: 0,
  },
});
