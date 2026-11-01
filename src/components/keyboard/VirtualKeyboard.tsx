import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useInputStore, KeyboardTab } from '@/stores/useInputStore';

export const VirtualKeyboard: React.FC = () => {
  const activeTab = useInputStore((state) => state.activeTab);
  const setActiveTab = useInputStore((state) => state.setActiveTab);
  const insertText = useInputStore((state) => state.insertText);
  const backspace = useInputStore((state) => state.backspace);

  const tabs: Array<{ id: KeyboardTab; label: string }> = [
    { id: '123', label: '123' },
    { id: 'f(x)', label: 'f(x)' },
    { id: 'abc', label: 'abc' },
    { id: '#&-' as KeyboardTab, label: '#&¬' },
  ];

  // Grid keys for tab '123'
  // Matches WhatsApp Image 2026-10-31 at 10.48.03 PM.jpeg
  const rows123 = [
    [
      { label: 'x', value: 'x' },
      { label: 'y', value: 'y' },
      { label: 'π', value: 'π' },
      { label: 'e', value: 'e' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '×', value: '*' },
      { label: '÷', value: '/' },
    ],
    [
      { label: 'x²', value: '²' },
      { label: 'xⁿ', value: '^' },
      { label: '√x', value: '√(' },
      { label: '|x|', value: '|' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '+', value: '+' },
      { label: '−', value: '-' },
    ],
    [
      { label: '<', value: '<' },
      { label: '>', value: '>' },
      { label: '≤', value: '≤' },
      { label: '≥', value: '≥' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '=', value: '=' },
      { label: '⌫', action: 'backspace' },
    ],
    [
      { label: 'ans', value: 'ans' },
      { label: ',', value: ',' },
      { label: '(', value: '(' },
      { label: ')', value: ')' },
      { label: '0', value: '0' },
      { label: '.', value: '.' },
      { label: '◀', action: 'left' },
      { label: '▶', action: 'right' },
      { label: '↵', action: 'enter' },
    ],
  ];

  const handleKeyPress = (key: { label: string; value?: string; action?: string }) => {
    if (key.action === 'backspace') {
      backspace();
    } else if (key.value) {
      insertText(key.value);
    }
  };

  return (
    <View testID="virtual-keyboard" style={styles.container}>
      {/* Keyboard Header Tabs */}
      <View style={styles.tabBar}>
        <View style={styles.tabGroup}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                testID={`keytab-${tab.id}`}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.moreButton} testID="keytab-more">
          <Ionicons name="ellipsis-horizontal" size={18} color={GeoGebraTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Keys Grid */}
      <View style={styles.keysGrid}>
        {rows123.map((row, rIdx) => (
          <View key={`r-${rIdx}`} style={styles.keyRow}>
            {row.map((k, cIdx) => (
              <TouchableOpacity
                key={`k-${rIdx}-${cIdx}`}
                testID={`key-${k.action || k.label}`}
                onPress={() => handleKeyPress(k)}
                style={[
                  styles.key,
                  k.action === 'backspace' || k.action === 'enter' ? styles.keyAction : null,
                ]}
              >
                <Text style={styles.keyText}>{k.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GeoGebraTheme.colors.keyboardBg,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: GeoGebraTheme.colors.borderLight,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: GeoGebraTheme.radii.activeTabPill,
  },
  tabButtonActive: {
    backgroundColor: GeoGebraTheme.colors.primaryPurpleLight,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  tabLabelInactive: {
    color: GeoGebraTheme.colors.textPrimary,
  },
  moreButton: {
    padding: 6,
  },
  keysGrid: {
    paddingHorizontal: 4,
    gap: 4,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  key: {
    flex: 1,
    height: 36,
    backgroundColor: GeoGebraTheme.colors.keyBg,
    borderRadius: GeoGebraTheme.radii.keyboardKey,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  keyAction: {
    backgroundColor: GeoGebraTheme.colors.keyActionBg,
  },
  keyText: {
    fontSize: 16,
    color: GeoGebraTheme.colors.keyText,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
});
