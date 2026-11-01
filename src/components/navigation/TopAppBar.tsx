import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

interface TopAppBarProps {
  title?: string;
  showProbabilityActions?: boolean;
  onOpenMenu: () => void;
  onOpenSettings?: () => void;
  onToggleCurve?: () => void;
  onToggleTable?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Suite Calculadora',
  showProbabilityActions = false,
  onOpenMenu,
  onOpenSettings,
  onToggleCurve,
  onToggleTable,
}) => {
  const isExamActive = useExamStore((state) => state.isExamActive);
  const formattedDuration = useExamStore((state) => state.formattedDuration);
  const batteryLevel = useExamStore((state) => state.batteryLevel);

  if (isExamActive) {
    return (
      <View testID="exam-header" style={styles.examContainer}>
        <StatusBar style="light" />
        <View style={styles.statusBarMock}>
          <Text style={styles.headerTitleSmall}>{title}</Text>
          <Text style={styles.timerText}>{formattedDuration}</Text>
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
            <Ionicons name="battery-full" size={16} color={GeoGebraTheme.colors.examTextOnGreen} />
          </View>
        </View>
        <View style={styles.examActionBar}>
          <TouchableOpacity
            testID="exam-menu-button"
            onPress={onOpenMenu}
            style={styles.iconButton}
            accessibilityLabel="Abrir menú"
          >
            <Ionicons name="menu" size={24} color={GeoGebraTheme.colors.examTextOnGreen} />
          </TouchableOpacity>

          <View style={styles.examActionRight}>
            <TouchableOpacity
              testID="exam-curve-button"
              onPress={onToggleCurve}
              style={styles.iconButton}
              accessibilityLabel="Curva de distribución"
            >
              <Ionicons name="pulse-outline" size={22} color={GeoGebraTheme.colors.examTextOnGreen} />
            </TouchableOpacity>

            <TouchableOpacity
              testID="exam-table-button"
              onPress={onToggleTable}
              style={styles.iconButton}
              accessibilityLabel="Tabla de valores"
            >
              <Ionicons name="grid-outline" size={22} color={GeoGebraTheme.colors.examTextOnGreen} />
            </TouchableOpacity>

            {onOpenSettings && (
              <TouchableOpacity
                testID="exam-settings-button"
                onPress={onOpenSettings}
                style={styles.iconButton}
                accessibilityLabel="Configuración"
              >
                <Ionicons name="settings-sharp" size={20} color={GeoGebraTheme.colors.examTextOnGreen} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View testID="normal-header" style={styles.normalContainer}>
      <StatusBar style="dark" />
      <TouchableOpacity
        testID="menu-button"
        onPress={onOpenMenu}
        style={styles.iconButton}
        accessibilityLabel="Abrir menú"
      >
        <Ionicons name="menu" size={26} color={GeoGebraTheme.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.actionRight}>
        {showProbabilityActions && (
          <>
            <TouchableOpacity
              testID="curve-button"
              onPress={onToggleCurve}
              style={styles.iconButton}
              accessibilityLabel="Curva de distribución"
            >
              <Ionicons name="pulse-outline" size={22} color={GeoGebraTheme.colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              testID="table-button"
              onPress={onToggleTable}
              style={styles.iconButton}
              accessibilityLabel="Tabla de valores"
            >
              <Ionicons name="grid-outline" size={22} color={GeoGebraTheme.colors.textPrimary} />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          testID="settings-button"
          onPress={onOpenSettings}
          style={styles.iconButton}
          accessibilityLabel="Configuración"
        >
          <Ionicons name="settings-sharp" size={24} color={GeoGebraTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  normalContainer: {
    height: 52,
    backgroundColor: GeoGebraTheme.colors.appBarBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: GeoGebraTheme.colors.gridLines,
  },
  examContainer: {
    backgroundColor: GeoGebraTheme.colors.examHeaderBg,
  },
  statusBarMock: {
    height: 28,
    backgroundColor: GeoGebraTheme.colors.examHeaderDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitleSmall: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontSize: 12,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  timerText: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontSize: 13,
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontSize: 12,
  },
  examActionBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  examActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});
