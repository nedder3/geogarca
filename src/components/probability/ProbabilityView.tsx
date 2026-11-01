import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';

export type DistributionType =
  | 'hypergeometric'
  | 'binomial'
  | 'poisson'
  | 'normal'
  | 'geometric';

export type IntervalMode = 'left' | 'between' | 'right';

interface TableRow {
  k: string;
  prob: string;
  inInterval: boolean;
}

interface DistributionMock {
  id: DistributionType;
  name: string;
  isContinuous?: boolean;
  parameters: Array<{ key: string; label: string; defaultValue: string }>;
  results: {
    left: string;
    between: string;
    right: string;
  };
  bars: Array<{ id: number; value: string; height: number }>;
  table: TableRow[];
}

const DISTRIBUTION_PRESETS: Record<DistributionType, DistributionMock> = {
  hypergeometric: {
    id: 'hypergeometric',
    name: 'Hipergeométrica',
    parameters: [
      { key: 'population', label: 'Population', defaultValue: '30' },
      { key: 'paramN', label: 'Parámetro n', defaultValue: '10' },
      { key: 'paramS', label: 'Éxitos s', defaultValue: '8' },
    ],
    results: {
      left: 'P(X ≤ 3) = 0.6420',
      between: 'P(2 ≤ X ≤ 4) = 0.7512',
      right: 'P(X ≥ 3) = 0.5810',
    },
    bars: [
      { id: 0, value: '0', height: 25 },
      { id: 1, value: '1', height: 60 },
      { id: 2, value: '2', height: 110 },
      { id: 3, value: '3', height: 160 },
      { id: 4, value: '4', height: 130 },
      { id: 5, value: '5', height: 75 },
      { id: 6, value: '6', height: 35 },
      { id: 7, value: '7', height: 15 },
    ],
    table: [
      { k: '0', prob: '0.0125', inInterval: false },
      { k: '1', prob: '0.0782', inInterval: false },
      { k: '2', prob: '0.2311', inInterval: true },
      { k: '3', prob: '0.3202', inInterval: true },
      { k: '4', prob: '0.1999', inInterval: true },
      { k: '5', prob: '0.1143', inInterval: false },
      { k: '6', prob: '0.0381', inInterval: false },
      { k: '7', prob: '0.0057', inInterval: false },
    ],
  },
  binomial: {
    id: 'binomial',
    name: 'Binomial',
    parameters: [
      { key: 'paramN', label: 'Ensayos n', defaultValue: '20' },
      { key: 'paramP', label: 'Probabilidad p', defaultValue: '0.5' },
    ],
    results: {
      left: 'P(X ≤ 10) = 0.5881',
      between: 'P(8 ≤ X ≤ 12) = 0.7368',
      right: 'P(X ≥ 10) = 0.5881',
    },
    bars: [
      { id: 0, value: '6', height: 30 },
      { id: 1, value: '7', height: 60 },
      { id: 2, value: '8', height: 105 },
      { id: 3, value: '9', height: 145 },
      { id: 4, value: '10', height: 165 },
      { id: 5, value: '11', height: 145 },
      { id: 6, value: '12', height: 105 },
      { id: 7, value: '13', height: 60 },
      { id: 8, value: '14', height: 30 },
    ],
    table: [
      { k: '6', prob: '0.0370', inInterval: false },
      { k: '7', prob: '0.0739', inInterval: false },
      { k: '8', prob: '0.1201', inInterval: true },
      { k: '9', prob: '0.1602', inInterval: true },
      { k: '10', prob: '0.1762', inInterval: true },
      { k: '11', prob: '0.1602', inInterval: true },
      { k: '12', prob: '0.1201', inInterval: true },
      { k: '13', prob: '0.0739', inInterval: false },
      { k: '14', prob: '0.0370', inInterval: false },
    ],
  },
  poisson: {
    id: 'poisson',
    name: 'Poisson',
    parameters: [{ key: 'paramLambda', label: 'Media λ', defaultValue: '4' }],
    results: {
      left: 'P(X ≤ 4) = 0.6288',
      between: 'P(2 ≤ X ≤ 6) = 0.7851',
      right: 'P(X ≥ 4) = 0.5665',
    },
    bars: [
      { id: 0, value: '0', height: 20 },
      { id: 1, value: '1', height: 75 },
      { id: 2, value: '2', height: 140 },
      { id: 3, value: '3', height: 175 },
      { id: 4, value: '4', height: 175 },
      { id: 5, value: '5', height: 135 },
      { id: 6, value: '6', height: 90 },
      { id: 7, value: '7', height: 50 },
      { id: 8, value: '8', height: 25 },
    ],
    table: [
      { k: '0', prob: '0.0183', inInterval: false },
      { k: '1', prob: '0.0733', inInterval: false },
      { k: '2', prob: '0.1465', inInterval: true },
      { k: '3', prob: '0.1954', inInterval: true },
      { k: '4', prob: '0.1954', inInterval: true },
      { k: '5', prob: '0.1563', inInterval: true },
      { k: '6', prob: '0.1042', inInterval: true },
      { k: '7', prob: '0.0595', inInterval: false },
      { k: '8', prob: '0.0298', inInterval: false },
    ],
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    isContinuous: true,
    parameters: [
      { key: 'paramMu', label: 'Media μ', defaultValue: '0' },
      { key: 'paramSigma', label: 'Desv. Est. σ', defaultValue: '1' },
    ],
    results: {
      left: 'P(X ≤ 0) = 0.5000',
      between: 'P(-1 ≤ X ≤ 1) = 0.6827',
      right: 'P(X ≥ 0) = 0.5000',
    },
    bars: [],
    table: [
      { k: '-3', prob: '0.0013', inInterval: false },
      { k: '-2', prob: '0.0228', inInterval: false },
      { k: '-1', prob: '0.1587', inInterval: true },
      { k: '0', prob: '0.5000', inInterval: true },
      { k: '1', prob: '0.8413', inInterval: true },
      { k: '2', prob: '0.9772', inInterval: false },
      { k: '3', prob: '0.9987', inInterval: false },
    ],
  },
  geometric: {
    id: 'geometric',
    name: 'Geométrica',
    parameters: [
      { key: 'paramP', label: 'Probabilidad p', defaultValue: '0.3' },
    ],
    results: {
      left: 'P(X ≤ 2) = 0.5100',
      between: 'P(1 ≤ X ≤ 3) = 0.6570',
      right: 'P(X ≥ 2) = 0.7000',
    },
    bars: [
      { id: 0, value: '1', height: 165 },
      { id: 1, value: '2', height: 115 },
      { id: 2, value: '3', height: 80 },
      { id: 3, value: '4', height: 55 },
      { id: 4, value: '5', height: 38 },
      { id: 5, value: '6', height: 26 },
    ],
    table: [
      { k: '1', prob: '0.3000', inInterval: true },
      { k: '2', prob: '0.2100', inInterval: true },
      { k: '3', prob: '0.1470', inInterval: true },
      { k: '4', prob: '0.1029', inInterval: false },
      { k: '5', prob: '0.0720', inInterval: false },
      { k: '6', prob: '0.0504', inInterval: false },
    ],
  },
};

interface ProbabilityViewProps {
  showTable?: boolean;
  showCurveOverlay?: boolean;
}

export const ProbabilityView: React.FC<ProbabilityViewProps> = ({
  showTable = false,
  showCurveOverlay = false,
}) => {
  const [selectedDist, setSelectedDist] = useState<DistributionType>('hypergeometric');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [intervalMode, setIntervalMode] = useState<IntervalMode>('left');

  const currentPreset = DISTRIBUTION_PRESETS[selectedDist];

  // Parameter state dictionary
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    population: '30',
    paramN: '10',
    paramS: '8',
    paramP: '0.5',
    paramLambda: '4',
    paramMu: '0',
    paramSigma: '1',
  });

  const handleSelectDistribution = (distId: DistributionType) => {
    setSelectedDist(distId);
    setIsPickerVisible(false);
  };

  const handleParamChange = (key: string, val: string) => {
    setParamValues((prev) => ({ ...prev, [key]: val }));
  };

  const isBarHighlighted = (index: number, total: number) => {
    if (intervalMode === 'left') return index <= Math.floor(total * 0.45);
    if (intervalMode === 'between')
      return index >= Math.floor(total * 0.25) && index <= Math.floor(total * 0.65);
    return index >= Math.floor(total * 0.45);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Distribution Dropdown Selector */}
      <View style={styles.selectorBar}>
        <TouchableOpacity
          testID="distribution-selector-btn"
          onPress={() => setIsPickerVisible(true)}
          style={styles.distributionPickerBtn}
          accessibilityLabel="Seleccionar distribución"
        >
          <View style={styles.distributionPickerInner}>
            <Text style={styles.distributionPickerLabel}>Distribución</Text>
            <View style={styles.distributionPickerRow}>
              <Text style={styles.distributionPickerValue}>{currentPreset.name}</Text>
              <Ionicons name="chevron-down" size={18} color="#5F6368" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Distribution Chart Viewport */}
      <View testID="probability-chart" style={styles.chartArea}>
        {currentPreset.isContinuous ? (
          // Continuous Normal Bell Curve
          <View testID="normal-continuous-curve" style={styles.continuousContainer}>
            <View style={styles.curveArea}>
              <View
                style={[
                  styles.bellCurveShape,
                  intervalMode === 'left' && styles.curveShadedLeft,
                  intervalMode === 'between' && styles.curveShadedBetween,
                  intervalMode === 'right' && styles.curveShadedRight,
                ]}
              />
            </View>
            <View style={styles.axisTicksRow}>
              <Text style={styles.axisTickText}>-3σ</Text>
              <Text style={styles.axisTickText}>-2σ</Text>
              <Text style={styles.axisTickText}>-1σ</Text>
              <Text style={[styles.axisTickText, styles.axisTickCenter]}>μ (0)</Text>
              <Text style={styles.axisTickText}>1σ</Text>
              <Text style={styles.axisTickText}>2σ</Text>
              <Text style={styles.axisTickText}>3σ</Text>
            </View>
          </View>
        ) : (
          // Discrete Distribution Bars
          <View style={styles.barsRow}>
            {currentPreset.bars.map((bar, idx) => {
              const highlighted = isBarHighlighted(idx, currentPreset.bars.length);
              return (
                <View key={bar.id} style={styles.barColumn}>
                  <View
                    testID={`histogram-bar-${bar.id}`}
                    style={[
                      styles.bar,
                      { height: bar.height },
                      highlighted ? styles.barFilled : styles.barHollow,
                    ]}
                  />
                  <Text style={styles.barLabel}>{bar.value}</Text>
                </View>
              );
            })}
          </View>
        )}
        <View style={styles.baseline} />
      </View>

      {/* Interval Selector Buttons */}
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

      {/* Formula & Probability Result */}
      <View style={styles.resultBanner}>
        <Text style={styles.resultText}>
          {currentPreset.results[intervalMode]}
        </Text>
      </View>

      {/* Dynamic Material Inputs for Current Distribution */}
      <View style={styles.inputsSection}>
        {currentPreset.parameters.map((param) => (
          <View key={param.key} style={styles.outlinedInputContainer}>
            <Text style={styles.floatingLabel}>{param.label}</Text>
            <TextInput
              testID={`input-${param.key}`}
              value={paramValues[param.key] ?? param.defaultValue}
              onChangeText={(txt) => handleParamChange(param.key, txt)}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>
        ))}
      </View>

      {/* Probability Table View (Toggleable) */}
      {showTable && (
        <View testID="probability-table" style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderCol1}>k</Text>
            <Text style={styles.tableHeaderCol2}>P(X = k)</Text>
          </View>
          {currentPreset.table.map((row, index) => (
            <View
              key={index}
              style={[
                styles.tableDataRow,
                row.inInterval && styles.tableDataRowActive,
              ]}
            >
              <Text
                style={[
                  styles.tableDataCol1,
                  row.inInterval && styles.tableTextActive,
                ]}
              >
                {row.k}
              </Text>
              <Text
                style={[
                  styles.tableDataCol2,
                  row.inInterval && styles.tableTextActive,
                ]}
              >
                {row.prob}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Distribution Picker Modal / Overlay */}
      {isPickerVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => setIsPickerVisible(false)}
            testID="modal-backdrop"
          />
          <View testID="distribution-picker-modal" style={styles.modalCard}>
            <Text style={styles.modalTitle}>Distribuciones de Probabilidad</Text>
            {Object.values(DISTRIBUTION_PRESETS).map((preset) => {
              const isSelected = selectedDist === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  testID={`dist-option-${preset.id}`}
                  onPress={() => handleSelectDistribution(preset.id)}
                  style={[
                    styles.modalOption,
                    isSelected && styles.modalOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {preset.name}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={GeoGebraTheme.colors.primaryPurple}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  selectorBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  distributionPickerBtn: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  distributionPickerInner: {
    position: 'relative',
  },
  distributionPickerLabel: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  distributionPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  distributionPickerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  chartArea: {
    height: 210,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    height: 180,
  },
  barColumn: {
    alignItems: 'center',
    minWidth: 28,
  },
  bar: {
    width: 28,
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
    fontSize: 10,
    color: '#666666',
    marginTop: 3,
  },
  baseline: {
    height: 1.5,
    backgroundColor: '#757575',
    width: '94%',
    alignSelf: 'center',
  },
  continuousContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  curveArea: {
    width: '80%',
    height: 140,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    borderWidth: 2.5,
    borderColor: '#3F2B7A',
    borderBottomWidth: 0,
    overflow: 'hidden',
    backgroundColor: '#F8F6FF',
  },
  bellCurveShape: {
    width: '100%',
    height: '100%',
  },
  curveShadedLeft: {
    backgroundColor: '#53468640',
    borderRightWidth: 2,
    borderRightColor: '#534686',
    width: '50%',
  },
  curveShadedBetween: {
    backgroundColor: '#53468640',
    width: '60%',
    alignSelf: 'center',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#534686',
  },
  curveShadedRight: {
    backgroundColor: '#53468640',
    width: '50%',
    alignSelf: 'flex-end',
    borderLeftWidth: 2,
    borderLeftColor: '#534686',
  },
  axisTicksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 4,
  },
  axisTickText: {
    fontSize: 10,
    color: '#777777',
  },
  axisTickCenter: {
    fontWeight: '700',
    color: '#333333',
  },
  intervalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
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
  tableCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0E0E6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E6',
  },
  tableHeaderCol1: {
    flex: 1,
    fontWeight: '700',
    color: '#333333',
    fontSize: 12,
  },
  tableHeaderCol2: {
    flex: 2,
    fontWeight: '700',
    color: '#333333',
    fontSize: 12,
    textAlign: 'right',
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  tableDataRowActive: {
    backgroundColor: '#F3EFFF',
  },
  tableDataCol1: {
    flex: 1,
    color: '#333333',
    fontSize: 13,
  },
  tableDataCol2: {
    flex: 2,
    color: '#333333',
    fontSize: 13,
    textAlign: 'right',
  },
  tableTextActive: {
    fontWeight: '700',
    color: '#534686',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
    elevation: 9999,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#F3EFFF',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333333',
  },
  modalOptionTextSelected: {
    color: '#534686',
    fontWeight: '700',
  },
});
