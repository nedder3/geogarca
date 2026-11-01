import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  const settingsItems = [
    { label: 'Redondeo', value: '2 cifras decimales' },
    { label: 'Etiquetado', value: 'Solo puntos nuevos' },
    { label: 'Tamaño de letra', value: '16 pt' },
    { label: 'Idioma', value: 'Español' },
  ];

  return (
    <View style={styles.overlay} testID="settings-dialog">
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        testID="settings-backdrop"
      />
      <View style={styles.dialogCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Propiedades</Text>
          <TouchableOpacity
            testID="settings-close-btn"
            onPress={onClose}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color="#555555" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {settingsItems.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          testID="settings-ok-btn"
          onPress={onClose}
          style={styles.okBtn}
        >
          <Text style={styles.okText}>Listo</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dialogCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    gap: 12,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  itemLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 14,
    color: GeoGebraTheme.colors.primaryPurple,
    fontWeight: '600',
  },
  okBtn: {
    backgroundColor: GeoGebraTheme.colors.primaryPurple,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  okText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
