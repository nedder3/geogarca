import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

export type MainTab = 'distribution' | 'algebra' | 'tools' | 'table' | 'spreadsheet';
export type AppNavigationMode = 'probability' | 'graphing';

interface BottomNavBarProps {
  activeTab: MainTab;
  onTabPress: (tab: MainTab) => void;
  mode?: AppNavigationMode;
}

const BellCurveIcon: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = '#FFFFFF' }) => (
  <View style={[styles.bellContainer, { width: size + 4, height: size }]}>
    <View
      style={[
        styles.bellDome,
        {
          width: size * 0.75,
          height: size * 0.65,
          borderColor: color,
        },
      ]}
    />
    <View style={[styles.bellBase, { width: size + 4, backgroundColor: color }]} />
  </View>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
  mode = 'probability',
}) => {
  const isExamActive = useExamStore((state) => state.isExamActive);

  const graphingTabs: Array<{ id: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'algebra', label: 'Álgebra', icon: 'calculator-outline' },
    { id: 'tools', label: 'Herramientas', icon: 'shapes-outline' },
    { id: 'table', label: 'Tabla', icon: 'grid-outline' },
    { id: 'spreadsheet', label: 'Hoja de Cálculo', icon: 'reader-outline' },
  ];

  const probabilityTabs: Array<{ id: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'distribution', label: 'Distribución', icon: 'pulse-outline' },
  ];

  const tabs = mode === 'probability' || activeTab === 'distribution' ? probabilityTabs : graphingTabs;

  return (
    <View
      testID="bottom-nav-bar"
      style={[
        styles.container,
        isExamActive && styles.containerExam,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconColor = isExamActive
          ? isActive
            ? GeoGebraTheme.colors.examTextOnGreen
            : '#80CBC4'
          : isActive
          ? GeoGebraTheme.colors.primaryPurple
          : GeoGebraTheme.colors.bottomNavInactive;

        return (
          <TouchableOpacity
            key={tab.id}
            testID={`tab-${tab.id}`}
            onPress={() => onTabPress(tab.id)}
            style={styles.tabButton}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View
              style={[
                styles.iconPill,
                isActive && (isExamActive ? styles.iconPillActiveExam : styles.iconPillActive),
              ]}
            >
              {tab.id === 'distribution' ? (
                <BellCurveIcon size={20} color={iconColor} />
              ) : (
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={iconColor}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                isExamActive
                  ? isActive
                    ? styles.labelActiveExam
                    : styles.labelInactiveExam
                  : isActive
                  ? styles.labelActive
                  : styles.labelInactive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: GeoGebraTheme.colors.bottomNavBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: GeoGebraTheme.colors.gridLines,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  containerExam: {
    backgroundColor: GeoGebraTheme.colors.examNavBg,
    borderTopColor: GeoGebraTheme.colors.examHeaderBorder,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconPill: {
    width: 48,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: GeoGebraTheme.colors.primaryPurpleLight,
  },
  iconPillActiveExam: {
    backgroundColor: GeoGebraTheme.colors.examNavActivePill,
  },
  label: {
    fontSize: GeoGebraTheme.typography.sizes.labelText,
    marginTop: 2,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  labelActive: {
    color: GeoGebraTheme.colors.primaryPurple,
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  labelInactive: {
    color: GeoGebraTheme.colors.bottomNavInactive,
  },
  labelActiveExam: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  labelInactiveExam: {
    color: '#80CBC4',
  },
  bellContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bellDome: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  bellBase: {
    height: 2,
  },
});
