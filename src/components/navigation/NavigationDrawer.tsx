import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

interface NavigationDrawerProps {
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
 * - Normal mode: WhatsApp Image 2026-10-31 at 10.48.04 PM (4).jpeg
 * - Exam mode: WhatsApp Image 2026-10-31 at 10.46.04 PM.jpeg
 */
export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  const isExamActive = useExamStore((state) => state.isExamActive);

  if (!visible) return null;

  // Options shown in Normal Mode
  const normalOptions: DrawerOption[] = [
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

  // Options restricted in Exam Mode
  const examOptions: DrawerOption[] = [
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
        <Text style={styles.headerTitle}>Calculadora Gráfica GeoGebra</Text>

        <View style={styles.optionsList}>
          {currentOptions.map((opt) => (
            <React.Fragment key={opt.id}>
              <TouchableOpacity
                testID={`drawer-opt-${opt.id}`}
                onPress={() => onSelectOption(opt.id)}
                style={styles.optionRow}
              >
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={GeoGebraTheme.colors.textSecondary}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
              {opt.showDividerAfter && <View style={styles.divider} />}
            </React.Fragment>
          ))}
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
    flexDirection: 'row',
    zIndex: 990,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerPane: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
    paddingHorizontal: 16,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 4, height: 0 },
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: GeoGebraTheme.typography.weights.medium,
    color: GeoGebraTheme.colors.textPrimary,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  optionsList: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  optionIcon: {
    marginRight: 20,
  },
  optionLabel: {
    fontSize: 15,
    color: GeoGebraTheme.colors.textPrimary,
    fontWeight: GeoGebraTheme.typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: GeoGebraTheme.colors.borderLight,
    marginVertical: 8,
  },
});
