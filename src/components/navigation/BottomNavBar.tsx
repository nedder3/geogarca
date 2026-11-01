import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

export type MainTab = 'algebra' | 'tools' | 'table' | 'spreadsheet';

interface BottomNavBarProps {
  activeTab: MainTab;
  onTabPress: (tab: MainTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const isExamActive = useExamStore((state) => state.isExamActive);

  const tabs: Array<{ id: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'algebra', label: 'Álgebra', icon: 'calculator-outline' },
    { id: 'tools', label: 'Herramientas', icon: 'shapes-outline' },
    { id: 'table', label: 'Tabla', icon: 'grid-outline' },
    { id: 'spreadsheet', label: 'Hoja de Cálculo', icon: 'reader-outline' },
  ];

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
              <Ionicons
                name={tab.icon}
                size={22}
                color={
                  isExamActive
                    ? isActive
                      ? GeoGebraTheme.colors.examTextOnGreen
                      : '#80CBC4'
                    : isActive
                    ? GeoGebraTheme.colors.primaryPurple
                    : GeoGebraTheme.colors.bottomNavInactive
                }
              />
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
    height: 64,
    backgroundColor: GeoGebraTheme.colors.bottomNavBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: GeoGebraTheme.colors.gridLines,
    paddingHorizontal: 8,
  },
  containerExam: {
    backgroundColor: GeoGebraTheme.colors.examNavBg,
    borderTopColor: GeoGebraTheme.colors.examHeaderBorder,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconPill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: GeoGebraTheme.radii.activeTabPill,
    marginBottom: 2,
  },
  iconPillActive: {
    backgroundColor: GeoGebraTheme.colors.purplePillBg,
  },
  iconPillActiveExam: {
    backgroundColor: GeoGebraTheme.colors.examNavActivePill,
  },
  label: {
    fontSize: 11,
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
});
