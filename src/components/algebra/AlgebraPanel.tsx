import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useInputStore } from '@/stores/useInputStore';

interface AlgebraItem {
  id: string;
  expression: string;
  color: string;
  type: 'function' | 'point' | 'line';
}

interface AlgebraPanelProps {
  onFocusInput?: () => void;
}

/**
 * AlgebraPanel matches WhatsApp Image 2026-10-31 at 10.48.03 PM.jpeg
 * Shows expression cards and the '+ Entrada' bar.
 */
export const AlgebraPanel: React.FC<AlgebraPanelProps> = ({ onFocusInput }) => {
  const currentExpression = useInputStore((state) => state.expression);
  const isKeyboardVisible = useInputStore((state) => state.isKeyboardVisible);
  const setKeyboardVisible = useInputStore((state) => state.setKeyboardVisible);

  // Mock items representing a typical GeoGebra algebra history list
  const mockItems: AlgebraItem[] = [
    { id: '1', expression: 'f(x) = x²', color: '#695BD4', type: 'function' },
    { id: '2', expression: 'A = (2, 3)', color: '#008476', type: 'point' },
  ];

  const handleInputBarPress = () => {
    setKeyboardVisible(true);
    onFocusInput?.();
  };

  return (
    <View testID="algebra-panel" style={styles.container}>
      <ScrollView style={styles.itemList} contentContainerStyle={styles.listContent}>
        {mockItems.map((item) => (
          <View key={item.id} testID={`algebra-item-${item.id}`} style={styles.itemCard}>
            <View style={[styles.circleIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.expressionText}>{item.expression}</Text>
            <TouchableOpacity style={styles.itemMenu}>
              <Ionicons name="ellipsis-vertical" size={18} color={GeoGebraTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Input Bar (+ Entrada) */}
        <TouchableOpacity
          testID="algebra-input-bar"
          onPress={handleInputBarPress}
          style={styles.inputBar}
        >
          <View style={styles.plusIconWrapper}>
            <Ionicons name="add" size={24} color={GeoGebraTheme.colors.textSecondary} />
          </View>
          <View style={styles.textInputArea}>
            <Text
              style={[
                styles.inputText,
                !currentExpression && styles.placeholderText,
              ]}
            >
              {currentExpression || 'Entrada...'}
            </Text>
            {isKeyboardVisible && <View style={styles.cursor} />}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  itemList: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    gap: 6,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: GeoGebraTheme.colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  circleIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  expressionText: {
    flex: 1,
    fontSize: 15,
    color: GeoGebraTheme.colors.textPrimary,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  itemMenu: {
    padding: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: GeoGebraTheme.colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginTop: 2,
  },
  plusIconWrapper: {
    paddingRight: 8,
  },
  textInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: GeoGebraTheme.colors.textPrimary,
  },
  placeholderText: {
    color: GeoGebraTheme.colors.textSecondary,
  },
  cursor: {
    width: 2,
    height: 18,
    backgroundColor: GeoGebraTheme.colors.primaryPurple,
    marginLeft: 2,
  },
});
