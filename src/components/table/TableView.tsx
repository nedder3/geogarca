import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GeoGebraTheme } from '@/theme/tokens';

export const TableView: React.FC = () => {
  const tableData = [
    { x: '-2', fx: '4' },
    { x: '-1', fx: '1' },
    { x: '0', fx: '0' },
    { x: '1', fx: '1' },
    { x: '2', fx: '4' },
  ];

  return (
    <View testID="table-view" style={styles.container}>
      <View style={styles.rangeBanner}>
        <Text style={styles.rangeText}>Rango de valores: -2 a 2 (paso 1)</Text>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.tableCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.col1]}>
              <Text style={styles.headerText}>x</Text>
            </View>
            <View style={[styles.cell, styles.col2]}>
              <Text style={styles.headerText}>f(x) = x²</Text>
            </View>
          </View>

          {/* Data Rows */}
          {tableData.map((row, idx) => (
            <View
              key={idx}
              style={[styles.row, idx % 2 === 1 && styles.rowAlt]}
            >
              <View style={[styles.cell, styles.col1]}>
                <Text style={styles.cellText}>{row.x}</Text>
              </View>
              <View style={[styles.cell, styles.col2]}>
                <Text style={[styles.cellText, styles.fxText]}>{row.fx}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  rangeBanner: {
    backgroundColor: '#F0F0F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rangeText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  tableCard: {
    borderWidth: 1,
    borderColor: '#E2E2E6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#E8E5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#D4CEFF',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: GeoGebraTheme.colors.primaryPurple,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  rowAlt: {
    backgroundColor: '#FAFAFA',
  },
  cell: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  col1: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: '#E2E2E6',
  },
  col2: {
    flex: 2,
  },
  cellText: {
    fontSize: 14,
    color: '#1F1F1F',
  },
  fxText: {
    fontWeight: '600',
    color: '#3F2B7A',
  },
});
