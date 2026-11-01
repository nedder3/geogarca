import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const SpreadsheetView: React.FC = () => {
  const columns = ['A', 'B', 'C', 'D'];
  const rows = [
    { id: '1', A: '1', B: '2', C: '', D: '' },
    { id: '2', A: '2', B: '4', C: '', D: '' },
    { id: '3', A: '3', B: '9', C: '', D: '' },
    { id: '4', A: '4', B: '16', C: '', D: '' },
    { id: '5', A: '5', B: '25', C: '', D: '' },
    { id: '6', A: '', B: '', C: '', D: '' },
  ];

  return (
    <View testID="spreadsheet-view" style={styles.container}>
      <ScrollView horizontal style={styles.horizontalScroll}>
        <View>
          {/* Header row with columns */}
          <View style={styles.headerRow}>
            <View style={styles.cornerCell} />
            {columns.map((col) => (
              <View key={col} style={styles.headerCell}>
                <Text style={styles.headerCellText}>{col}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          <ScrollView style={styles.verticalScroll}>
            {rows.map((row) => (
              <View key={row.id} style={styles.row}>
                <View style={styles.rowNumberCell}>
                  <Text style={styles.rowNumberText}>{row.id}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.A}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.B}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.C}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.D}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F4',
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4DC',
  },
  cornerCell: {
    width: 36,
    height: 32,
    borderRightWidth: 1,
    borderRightColor: '#D4D4DC',
    backgroundColor: '#EAEAEF',
  },
  headerCell: {
    width: 75,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D4D4DC',
  },
  headerCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  rowNumberCell: {
    width: 36,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8FA',
    borderRightWidth: 1,
    borderRightColor: '#D4D4DC',
  },
  rowNumberText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
  },
  cell: {
    width: 75,
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  cellText: {
    fontSize: 13,
    color: '#1F1F1F',
  },
});
