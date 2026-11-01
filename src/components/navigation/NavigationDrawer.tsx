import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

interface NavigationDrawerProps {
  title?: string;
  activeAppMode?: 'probability' | 'graphing';
  visible: boolean;
  onClose: () => void;
  onSelectOption: (optionId: string) => void;
}

export interface DrawerOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showDividerAfter?: boolean;
}

/**
 * NavigationDrawer replicates the side menu seen in:
 * - media_1793555517262_6b4ff508.png (Suite Calculadora GeoGebra Official)
 */
export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  title = 'Suite Calculadora GeoGebra',
  activeAppMode = 'probability',
  visible,
  onClose,
  onSelectOption,
}) => {
  const isExamActive = useExamStore((state) => state.isExamActive);

  if (!visible) return null;

  // Options shown in Normal Mode
  const normalOptions: DrawerOption[] = [
    { id: 'switch_probability', label: 'Probabilidad', icon: 'pulse-outline' },
    { id: 'switch_graphing', label: 'Calculadora Gráfica', icon: 'calculator-outline', showDividerAfter: true },
    { id: 'clear_all', label: 'Borrar todo', icon: 'close-outline' },
    { id: 'open', label: 'Abrir', icon: 'search-outline' },
    { id: 'save', label: 'Guardar', icon: 'save-outline' },
    { id: 'share', label: 'Compartir', icon: 'share-social-outline' },
    { id: 'export_image', label: 'Exportar imagen', icon: 'image-outline' },
    { id: 'exam', label: 'Examen', icon: 'hourglass-outline', showDividerAfter: true },
    { id: 'settings', label: 'Propiedades', icon: 'settings-outline' },
    { id: 'help', label: 'Ayuda & Comentarios', icon: 'help-circle-outline', showDividerAfter: true },
    { id: 'login', label: 'Abrir sesión', icon: 'log-in-outline' },
  ];

  // Options shown in Exam Mode (retains sub-app switching to prevent getting anchored)
  const examOptions: DrawerOption[] = [
    { id: 'switch_probability', label: 'Probabilidad', icon: 'pulse-outline' },
    { id: 'switch_graphing', label: 'Calculadora Gráfica', icon: 'calculator-outline', showDividerAfter: true },
    { id: 'clear_all', label: 'Borrar todo', icon: 'close-outline' },
    { id: 'open', label: 'Abrir', icon: 'search-outline' },
    { id: 'save', label: 'Guardar', icon: 'save-outline' },
    { id: 'exam_log', label: 'Registro de Examen', icon: 'clipboard-outline' },
    { id: 'exit_exam', label: 'Abandonar modo Examen', icon: 'hourglass-outline' },
  ];

  const currentOptions = isExamActive ? examOptions : normalOptions;

  return (
    <View style={styles.overlay} testID="navigation-drawer">
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        testID="drawer-backdrop"
        accessibilityLabel="Cerrar menú"
      />
      <View style={styles.drawerPane}>
        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.optionsList}>
          {currentOptions.map((opt) => {
            const isSubAppActive =
              (opt.id === 'switch_probability' && activeAppMode === 'probability') ||
              (opt.id === 'switch_graphing' && activeAppMode === 'graphing');

            return (
              <React.Fragment key={opt.id}>
                <TouchableOpacity
                  testID={`drawer-opt-${opt.id}`}
                  onPress={() => onSelectOption(opt.id)}
                  style={[styles.optionRow, isSubAppActive && styles.optionRowActive]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={
                      isSubAppActive
                        ? GeoGebraTheme.colors.primaryPurple
                        : GeoGebraTheme.colors.textSecondary
                    }
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      isSubAppActive && styles.optionLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
                {opt.showDividerAfter && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawerPane: {
    width: 290,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 36,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: GeoGebraTheme.typography.weights.bold,
    color: GeoGebraTheme.colors.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  optionsList: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionRowActive: {
    backgroundColor: '#F3EFFF',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 15,
    color: GeoGebraTheme.colors.textPrimary,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  optionLabelActive: {
    color: GeoGebraTheme.colors.primaryPurple,
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: GeoGebraTheme.colors.borderLight,
    marginVertical: 6,
  },
});
